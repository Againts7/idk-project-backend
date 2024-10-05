const chalk = require("chalk");
const searchSimilarity = require("../string-similarity");

function searchKec(kec, kodeWilayahList, addReport) {
  if (!kec) return [];
  let kecDitemukan = [];

  kecDitemukan = kodeWilayahList.filter(
    ({ kode, nama }) =>
      kode.length === 8 &&
      (nama === kec || nama.includes(kec) || kec.includes(nama))
  );

  if (kecDitemukan && kecDitemukan.length > 0) {
    console.log(
      chalk.bgCyan("kecDitemukan\n"),
      kecDitemukan,
      "\n============================================================"
    );
    const kodeKec = kecDitemukan.map((item) => item.kode);

    const dataTurunan = kodeWilayahList.filter((item) =>
      kodeKec.some((kode) => item.kode.startsWith(kode))
    );

    kecDitemukan = dataTurunan;
    addReport("kec turunan ditemukan sebanyak: " + kecDitemukan.length);
  } else {
    addReport("kec gagal ditemukan");
    const namakec = kodeWilayahList
      .filter((item) => item.kode.length === 8)
      .map((item) => item.nama);

    const similarity = searchSimilarity(kec, namakec);

    if (similarity) {
      kecDitemukan = kodeWilayahList.find(
        ({ kode, nama }) => kode.length === 8 && (nama === similarity || kec)
      );
    }
  }

  return kecDitemukan;
}

module.exports = searchKec;
