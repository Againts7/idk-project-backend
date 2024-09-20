const {
  sharpResizeUntilMinimum,
  resizeImageToCover,
  resizeImageToFill,
  sharpConvertToJpeg,
} = require("../utils/sharp");

async function sharpCropSquare(req, res, next) {
  res.send(true);
}

async function sharpGet(req, res, next) {
  res.send(true);
}

async function sharpResize(req, res, next) {
  const { link, size = 500 } = req.query;
  if (!link) return res.status(403).send("ea");
  try {
    const buffer = await sharpResizeUntilMinimum(link, Number(size));
    res.type("image/jpeg");
    res.send(buffer);
  } catch (e) {
    next(e);
  }
}

async function sharpResizeLikeCSS(req, res, next) {
  if (!req.file) {
    return res.status(400).send("Tidak ada file yang diunggah.");
  }
  const { how } = req.body;
  const fileBuffer = req.file.buffer;
  const filetype = req.file.mimetype;
  try {
    if (how === "cover") {
      const file = await resizeImageToCover(fileBuffer);
      res.type(filetype);
      return res.send(file);
    }
    if (how === "fill") {
      const file = await resizeImageToFill(fileBuffer);
      res.type(filetype);
      return res.send(file);
    }
  } catch (e) {
    next(e);
  }
}

async function sharpConvertToJpegController(req, res, next) {
  const { type, url } = req.body;
  const fileBuffer = req?.file?.buffer;
  try {
    if (type === "file") {
      const jpegBuffer = await sharpConvertToJpeg(fileBuffer);
      res.type("image/jpeg");
      res.send(jpegBuffer);
    } else {
      const jpegBuffer = await sharpConvertToJpeg(url);
      res.type("image/jpeg");
      res.send(jpegBuffer);
    }
  } catch (e) {
    next(e);
  }
}

module.exports = {
  sharpResize,
  sharpGet,
  sharpCropSquare,
  sharpResizeLikeCSS,
  sharpConvertToJpegController,
};
