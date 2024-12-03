const express = require("express");
const { getByID } = require("../controllers/corynScrapper.Controller");

const router = express.Router();

router.get("/", getByID);

module.exports = router;
