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
    if (kecDitemukan.length === 1) return kecDitemukan;

    const listNama = kecDitemukan.map((item) => item.nama);

    const namaPalingMirip = searchSimilarity(kec, listNama);

    if (namaPalingMirip) {
      kecDitemukan = kecDitemukan.filter(({ nama }) => nama == namaPalingMirip);
    }

    addReport("kec turunan ditemukan sebanyak: " + kecDitemukan.length);
    console.log(
      chalk.bgCyan("kecDitemukan\n"),
      kecDitemukan,
      "\n============================================================"
    );
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
