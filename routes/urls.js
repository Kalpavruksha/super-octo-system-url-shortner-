const express = require('express');
const {
    createShortUrl,
    getUserUrls,
    getUrlAnalytics,
    deleteUrl,
    updateUrl
} = require('../controllers/urlController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', optionalAuth, createShortUrl);
router.get('/', protect, getUserUrls);
router.get('/:shortCode/analytics', protect, getUrlAnalytics);
router.put('/:shortCode', protect, updateUrl);
router.delete('/:shortCode', protect, deleteUrl);

module.exports = router;
