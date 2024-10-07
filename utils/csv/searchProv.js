const chalk = require("chalk");
const searchSimilarity = require("../string-similarity");

function searchProv(prov, kodeWilayahList, addReport) {
  if (!prov) return [];

  let provDitemukan = [];

  provDitemukan = kodeWilayahList.filter(
    ({ kode, nama }) =>
      kode.length === 2 &&
      (nama === prov || nama.includes(prov) || prov.includes(nama))
  );

  if (provDitemukan && provDitemukan.length > 0) {
    if (provDitemukan.length === 1) return provDitemukan;

    const listNama = provDitemukan.map((item) => item.nama);

    const namaPalingMirip = searchSimilarity(prov, listNama);

    if (namaPalingMirip) {
      provDitemukan = provDitemukan.filter(
        ({ nama }) => nama === namaPalingMirip
      );
    }

    console.log(
      chalk.bgCyan("prov ditemukan\n"),
      provDitemukan,
      "\n============================================================"
    );
    addReport("prov turunan ditemukan sebanyak: " + provDitemukan.length);
  } else {
    addReport("prov gagal ditemukan");
    const namaprov = kodeWilayahList
      .filter((item) => item.kode.length === 2)
      .map((item) => item.nama);

    const similarity = searchSimilarity(prov, namaprov);

    if (similarity) {
      provDitemukan = [
        kodeWilayahList.find(
          ({ kode, nama }) => kode.length === 2 && (nama === similarity || prov)
        ),
      ];
    }
  }

  return provDitemukan;
}

module.exports = searchProv;
