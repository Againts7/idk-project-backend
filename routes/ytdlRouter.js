const express = require('express');

const router = express.Router();

const { ytdlGet, ytdlDownload } = require('../controllers/ytdlController');

router.get('/', ytdlGet);

router.get('/download', ytdlDownload);

module.exports = router;
