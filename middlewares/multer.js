const multer = require("multer");

// Konfigurasi Multer untuk penyimpanan di memori

const uploadToMemory = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Batas ukuran file 5MB (sesuaikan sesuai kebutuhan)
  },
});

module.exports = uploadToMemory;
