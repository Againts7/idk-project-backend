const express = require("express");

const router = express.Router();

const ytdlRouter = require("./ytdlRouter");
const sharpRouter = require("./sharpRouter");
const loginRouter = require("./loginRouter");
const getUserDataRouter = require("./getUserDataRouter");
const registerRouter = require("./registerRouter");
const verifyToken = require("../middlewares/jsonwebtoken");

router.use("/ytdl", verifyToken, ytdlRouter);
router.use("/sharp", verifyToken, sharpRouter);
router.use("/login", loginRouter);
router.use("/get-user-data", verifyToken, getUserDataRouter);
router.use("/register", registerRouter);

module.exports = router;
