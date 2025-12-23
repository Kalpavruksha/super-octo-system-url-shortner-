const mongoose = require('mongoose');

const ClickSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    ipAddress: String,
    userAgent: String,
    referrer: String,
    country: String,
    city: String
});

const UrlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: [true, 'Please provide a URL'],
        match: [
            /^https?:\/\/.+/,
            'Please provide a valid URL starting with http:// or https://'
        ]
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    customAlias: {
        type: String,
        trim: true,
        sparse: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    clicks: [ClickSchema],
    clickCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tags: [String],
    description: String
});

// Index for faster lookups (shortCode already has unique index from schema)
UrlSchema.index({ user: 1 });
UrlSchema.index({ expiresAt: 1 });

// Virtual for full short URL
UrlSchema.virtual('shortUrl').get(function () {
    return `${process.env.BASE_URL}/${this.shortCode}`;
});

// Check if URL is expired
UrlSchema.methods.isExpired = function () {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
};

// Record a click
UrlSchema.methods.recordClick = async function (clickData) {
    this.clicks.push(clickData);
    this.clickCount += 1;
    await this.save();
};

// Get analytics
UrlSchema.methods.getAnalytics = function () {
    const now = new Date();
    const last24h = new Date(now - 24 * 60 * 60 * 1000);
    const last7d = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now - 30 * 24 * 60 * 60 * 1000);

    return {
        totalClicks: this.clickCount,
        clicksLast24h: this.clicks.filter(c => c.timestamp > last24h).length,
        clicksLast7d: this.clicks.filter(c => c.timestamp > last7d).length,
        clicksLast30d: this.clicks.filter(c => c.timestamp > last30d).length,
        uniqueReferrers: [...new Set(this.clicks.map(c => c.referrer).filter(Boolean))],
        topReferrers: this.getTopReferrers(),
        clicksByDate: this.getClicksByDate(),
        recentClicks: this.clicks.slice(-10).reverse()
    };
};

UrlSchema.methods.getTopReferrers = function (limit = 5) {
    const referrerCounts = {};
    this.clicks.forEach(click => {
        if (click.referrer) {
            referrerCounts[click.referrer] = (referrerCounts[click.referrer] || 0) + 1;
        }
    });

    return Object.entries(referrerCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([referrer, count]) => ({ referrer, count }));
};

UrlSchema.methods.getClicksByDate = function () {
    const clicksByDate = {};
    this.clicks.forEach(click => {
        const date = click.timestamp.toISOString().split('T')[0];
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;
    });

    return Object.entries(clicksByDate)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, count]) => ({ date, count }));
};

module.exports = mongoose.model('Url', UrlSchema);
