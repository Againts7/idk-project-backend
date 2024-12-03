const express = require("express");

const router = express.Router();
const verifyToken = require("../middlewares/jsonwebtoken");

const ytdlRouter = require("./ytdlRouter");
const sharpRouter = require("./sharpRouter");
const loginRouter = require("./loginRouter");
const getUserDataRouter = require("./getUserDataRouter");
const registerRouter = require("./registerRouter");
const postcodeRouter = require("./postcodeRouter");
const kodeWilayahRouter = require("./kodeWilayahRouter");
const coryn = require("./corynScrapperRouter");

router.use("/ytdl", verifyToken, ytdlRouter);
router.use("/sharp", verifyToken, sharpRouter);
router.use("/login", loginRouter);
router.use("/get-user-data", verifyToken, getUserDataRouter);
router.use("/get-data-from-postcode", postcodeRouter);
router.use("/register", registerRouter);
router.use("/get-kode-wilayah", kodeWilayahRouter);
router.use("/coryn-scrapper", coryn);

module.exports = router;
