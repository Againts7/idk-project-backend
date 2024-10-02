const { default: axios } = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const { postcode } = req.query;
  try {
    if (!postcode) throw new Error("tidak terdapat kodepos");
    const response = await axios.get(
      `https://kodepos.co.id/kodepos/${postcode}`
    );
    const $ = await cheerio.load(response.data);

    // Mengambil data dari elemen sesuai selector
    const result = await $("table > tbody > tr > td:nth-child(1) > a").html();

    // Menampilkan hasil
    console.log("Hasil:", result);

    if (result) {
      res.json({ status: "success", data: { kode_wilayah: result } });
    } else {
      throw new Error("gagal mengambil data cheerio");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
