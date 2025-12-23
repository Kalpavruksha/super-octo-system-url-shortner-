const Url = require('../models/Url');

// @desc    Redirect to original URL
// @route   GET /:shortCode
// @access  Public
exports.redirectToUrl = async (req, res, next) => {
    try {
        const { shortCode } = req.params;

        const url = await Url.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({
                success: false,
                error: 'URL not found'
            });
        }

        // Check if URL is expired
        if (url.isExpired()) {
            return res.status(410).json({
                success: false,
                error: 'This URL has expired'
            });
        }

        // Check if URL is active
        if (!url.isActive) {
            return res.status(403).json({
                success: false,
                error: 'This URL has been deactivated'
            });
        }

        // Record click analytics
        const clickData = {
            timestamp: new Date(),
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent'),
            referrer: req.get('referrer') || req.get('referer') || 'Direct'
        };

        await url.recordClick(clickData);

        // Redirect to original URL
        res.redirect(url.originalUrl);
    } catch (error) {
        next(error);
    }
};
