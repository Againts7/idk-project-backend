const chalk = require("chalk");
const searchSimilarity = require("../string-similarity");

function searchKeldes(keldes, kodeWilayahList, addReport) {
  if (!keldes) return [];

  let keldesDitemukan = [];

  keldesDitemukan =
    kodeWilayahList.filter(
      ({ kode, nama }) =>
        kode.length === 13 &&
        (nama === keldes ||
          nama.includes(keldes) ||
          keldes.includes(nama) ||
          searchSimilarity(keldes, [nama]) === nama)
    ) || [];

  if (keldesDitemukan && keldesDitemukan.length > 0) {
    if (keldesDitemukan.length === 1) return keldesDitemukan;

    console.log(
      chalk.bgWhite("keldes ditemukan\n"),
      keldesDitemukan,
      "\n=================================================================="
    );
    const listNama = keldesDitemukan.map((item) => item.nama);

    const namaPalingMirip = searchSimilarity(keldes, listNama);

    console.log("nama paling mirip keldes", namaPalingMirip);

    if (namaPalingMirip) {
      keldesDitemukan = keldesDitemukan.filter(
        ({ nama }) => nama === namaPalingMirip
      );
    }

    addReport("keldes ditemukan sebanyak: " + keldesDitemukan.length);
    console.log(
      chalk.bgWhite("keldes ditemukan\n"),
      keldesDitemukan,
      "\n=================================================================="
    );
  } else {
    addReport("keldes tidak ditemukan");

    const namakeldes = kodeWilayahList
      .filter((item) => item.kode.length === 13)
      .map((item) => item.nama);

    const similarity = searchSimilarity(keldes, namakeldes);

    if (similarity) {
      kodeWilayahList = kodeWilayahList.find(
        ({ kode, nama }) =>
          kode.length === 13 && (nama === similarity || keldes)
      );
    }
  }

  return keldesDitemukan;
}

module.exports = searchKeldes;
