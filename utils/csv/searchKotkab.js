const chalk = require("chalk");
const searchSimilarity = require("../string-similarity");

function searchKotKab(kotkab, kodeWilayahList, addReport) {
  if (!kotkab) return [];

  let kotkabDitemukan = [];
  kotkabDitemukan = kodeWilayahList.filter(
    ({ kode, nama }) =>
      kode.length === 5 &&
      (nama === kotkab ||
        nama.includes(kotkab) ||
        kotkab.includes(nama) ||
        kotkab
          .replace(/^(kota|kabupaten|kab\.?)/, "")
          .trim()
          .includes(nama.replace(/^(kota|kabupaten|kab\.?)/, "").trim()))
  );

  console.log(chalk.bgMagenta("kotkab"), kotkabDitemukan);

  if (kotkabDitemukan && kotkabDitemukan.length > 0) {
    if (kotkabDitemukan.length === 1) return kotkabDitemukan;

    const listNama = kotkabDitemukan.map((item) => item.nama);

    const namaPalingMirip = searchSimilarity(kotkab, listNama);

    if (namaPalingMirip) {
      const apaKota = kotkabDitemukan.some(({ nama }) => /^(kota)/.test(nama));

      if (apaKota && /^(kota)/.test(kotkab)) {
        kotkabDitemukan = kotkabDitemukan.filter(({ nama }) =>
          /^(kota)/.test(nama)
        );
      } else {
        kotkabDitemukan = kotkabDitemukan.filter(
          ({ nama }) => nama === namaPalingMirip
        );
      }
    }

    addReport("kotkab turunan ditemukan sebanyak: " + kotkabDitemukan.length);
    console.log(
      chalk.bgCyan("kotkab ditemukan\n"),
      kotkabDitemukan,
      "\n============================================================"
    );
  } else {
    addReport("kotkab gagal ditemukan");
    const namakotkab = kodeWilayahList
      .filter((item) => item.kode.length === 5)
      .map((item) => item.nama);

    const similarity = searchSimilarity(kotkab, namakotkab);

    if (similarity) {
      kotkabDitemukan = [
        kodeWilayahList.find(
          ({ kode, nama }) =>
            kode.length === 5 && (nama === similarity || kotkab)
        ),
      ];
    }
  }

  return kotkabDitemukan;
}

module.exports = searchKotKab;
