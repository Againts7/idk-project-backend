const express = require("express");

const router = express.Router();

const {
  sharpGet,
  sharpCropSquare,
  sharpResize,
  sharpResizeLikeCSS,
  sharpConvertToJpegController,
} = require("../controllers/sharpController");
const uploadToMemory = require("../middlewares/multer");

router.get("/", sharpGet);

router.get("/crop-square", sharpCropSquare);
router.get("/resize", sharpResize);
router.post("/resize", uploadToMemory.single("file"), sharpResizeLikeCSS);
router.post(
  "/convert-to-jpeg",
  uploadToMemory.single("file"),
  sharpConvertToJpegController
);

module.exports = router;
