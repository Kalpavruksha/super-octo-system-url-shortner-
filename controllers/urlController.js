const { nanoid } = require('nanoid');
const Url = require('../models/Url');

// @desc    Create short URL
// @route   POST /api/urls
// @access  Public/Private (optional auth)
exports.createShortUrl = async (req, res, next) => {
    try {
        const { originalUrl, customAlias, expiryDays, tags, description } = req.body;

        if (!originalUrl) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a URL'
            });
        }

        // Generate short code
        let shortCode = customAlias || nanoid(7);

        // Check if custom alias already exists
        if (customAlias) {
            const existing = await Url.findOne({ shortCode: customAlias });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    error: 'Custom alias already taken'
                });
            }
        }

        // Calculate expiry date
        let expiresAt = null;
        if (expiryDays) {
            expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + parseInt(expiryDays));
        } else if (process.env.DEFAULT_EXPIRY_DAYS) {
            expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + parseInt(process.env.DEFAULT_EXPIRY_DAYS));
        }

        // Create URL
        const url = await Url.create({
            originalUrl,
            shortCode,
            customAlias: customAlias || undefined,
            user: req.user ? req.user._id : undefined,
            expiresAt,
            tags: tags || [],
            description: description || ''
        });

        res.status(201).json({
            success: true,
            data: {
                originalUrl: url.originalUrl,
                shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
                shortCode: url.shortCode,
                expiresAt: url.expiresAt,
                createdAt: url.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all URLs for logged in user
// @route   GET /api/urls
// @access  Private
exports.getUserUrls = async (req, res, next) => {
    try {
        const urls = await Url.find({ user: req.user._id })
            .sort('-createdAt')
            .select('-clicks');

        const urlsWithStats = urls.map(url => ({
            id: url._id,
            originalUrl: url.originalUrl,
            shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
            shortCode: url.shortCode,
            clickCount: url.clickCount,
            createdAt: url.createdAt,
            expiresAt: url.expiresAt,
            isActive: url.isActive,
            isExpired: url.isExpired(),
            tags: url.tags,
            description: url.description
        }));

        res.status(200).json({
            success: true,
            count: urls.length,
            data: urlsWithStats
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get URL analytics
// @route   GET /api/urls/:shortCode/analytics
// @access  Private
exports.getUrlAnalytics = async (req, res, next) => {
    try {
        const url = await Url.findOne({ shortCode: req.params.shortCode });

        if (!url) {
            return res.status(404).json({
                success: false,
                error: 'URL not found'
            });
        }

        // Check if user owns this URL
        if (url.user && url.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to view analytics for this URL'
            });
        }

        const analytics = url.getAnalytics();

        res.status(200).json({
            success: true,
            data: {
                url: {
                    originalUrl: url.originalUrl,
                    shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
                    shortCode: url.shortCode,
                    createdAt: url.createdAt,
                    expiresAt: url.expiresAt
                },
                analytics
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete URL
// @route   DELETE /api/urls/:shortCode
// @access  Private
exports.deleteUrl = async (req, res, next) => {
    try {
        const url = await Url.findOne({ shortCode: req.params.shortCode });

        if (!url) {
            return res.status(404).json({
                success: false,
                error: 'URL not found'
            });
        }

        // Check if user owns this URL
        if (url.user && url.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this URL'
            });
        }

        await url.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update URL
// @route   PUT /api/urls/:shortCode
// @access  Private
exports.updateUrl = async (req, res, next) => {
    try {
        let url = await Url.findOne({ shortCode: req.params.shortCode });

        if (!url) {
            return res.status(404).json({
                success: false,
                error: 'URL not found'
            });
        }

        // Check if user owns this URL
        if (url.user && url.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update this URL'
            });
        }

        const { isActive, tags, description } = req.body;

        if (isActive !== undefined) url.isActive = isActive;
        if (tags !== undefined) url.tags = tags;
        if (description !== undefined) url.description = description;

        await url.save();

        res.status(200).json({
            success: true,
            data: url
        });
    } catch (error) {
        next(error);
    }
};
// handle create short url request
// generate unique short code
// handle redirect using short code
// handle invalid short code
// improve response formatting
