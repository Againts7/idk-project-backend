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
    // const kodeKeldes = keldesDitemukan.map((item) => item.kode);

    // const dataTurunan = kodeWilayahList.filter((item) =>
    //   kodeKeldes.some((kode) => item.kode.startsWith(kode))
    // );

    // keldesDitemukan = dataTurunan;

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
