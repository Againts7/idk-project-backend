const express = require("express");
const { searchKodeWilayah, getRandomKodeWilayah } = require("../utils/csv");
const {
  getProvinsiList,
  getKabupatenKotaList,
  getKelDesList,
  getKecamatanList,
} = require("../utils/get-address");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const {
      prov = "",
      kotkab = "",
      kec = "",
      keldes = "",
      kode = "",
    } = req.query;

    if (kode) {
      if (kode === "list") {
        const data = await getProvinsiList(kode);
        return res.json({ status: "success", data });
      } else if (kode.length === 2) {
        const data = await getKabupatenKotaList(kode);
        return res.json({ status: "success", data });
      } else if (kode.length === 5) {
        const data = await getKecamatanList(kode);
        return res.json({ status: "success", data });
      } else if (kode.length === 8) {
        const data = await getKelDesList(kode);
        return res.json({ status: "success", data });
      } else {
        const data = await getProvinsiList(kode);
        return res.json({ status: "success", data });
      }
    }

    console.log("query:", prov, kotkab, kec, keldes);

    let result = await searchKodeWilayah({ prov, kotkab, kec, keldes });

    console.log("ini result router", result);

    if (result && result[0]?.kode?.length !== 13) {
      result = [await getRandomKodeWilayah(result[0].kode)];
    }

    if (!result) {
      throw new Error("kode wilayah tidak ditemukan!");
    }

    return res.json({ status: "success", data: result });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
