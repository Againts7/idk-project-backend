const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const { postcode } = req.query;

  try {
    if (!postcode) {
      throw new Error("Kode pos tidak diberikan");
    }

    const response = await axios.get(
      `https://kodeposku.com/kodepos/${postcode}`
    );

    const $ = cheerio.load(response.data);

    // Mengambil data dari elemen sesuai selector
    const result = $("table > tbody > tr:nth-child(2) > td:nth-child(2) > a")
      .text()
      .trim();

    // Cek apakah hasil ditemukan
    if (result) {
      res.json({ status: "success", data: { kode_wilayah: result } });
    } else {
      throw new Error("Gagal menemukan data untuk kode pos tersebut");
    }
  } catch (error) {
    console.error("Error:", error.message);
    next(error);
  }
});

module.exports = router;

module.exports = router;
