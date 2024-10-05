const express = require("express");
const searchKodeWilayah = require("../utils/csv");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { prov, kotkab, kec, keldes } = req.query;
    if (!prov) {
      throw new Error("setidaknya prov");
    }
    const result = await searchKodeWilayah({ prov, kotkab, kec, keldes });
    return res.json({ status: "success", data: result });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
