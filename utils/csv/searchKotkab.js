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

  if (kotkabDitemukan && kotkabDitemukan.length > 0) {
    console.log(
      chalk.bgCyan("kotkab ditemukan\n"),
      kotkabDitemukan,
      "\n============================================================"
    );
    const kodeKotkab = kotkabDitemukan.map((item) => item.kode);

    const dataTurunan = kodeWilayahList.filter((item) =>
      kodeKotkab.some((kode) => item.kode.startsWith(kode))
    );

    kotkabDitemukan = dataTurunan;

    addReport("kotkab turunan ditemukan sebanyak: " + kotkabDitemukan.length);
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
