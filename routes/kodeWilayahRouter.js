const express = require("express");
const { searchKodeWilayah, getRandomKodeWilayah } = require("../utils/csv");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { prov, kotkab, kec, keldes } = req.query;

    let result = await searchKodeWilayah({ prov, kotkab, kec, keldes });

    console.log("ini result router", result);

    if (result && result[0]?.kode?.length !== 13) {
      result = [await getRandomKodeWilayah(result[0].kode)];
    }

    return res.json({ status: "success", data: result });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
