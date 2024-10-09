const { readCSV } = require("./csv");

function capitalize(kalimat) {
  return kalimat
    .split(" ")
    .map((kata) => kata.charAt(0).toUpperCase() + kata.slice(1).toLowerCase())
    .join(" ");
}

async function getProvinsiList() {
  const data = (await readCSV()).map((item) => {
    return { ...item, nama: capitalize(item.nama) };
  });

  const result = data.filter((item) => item.kode.length === 2);
  return result;
}

async function getKabupatenKotaList(kodeProvinsi) {
  const data = (await readCSV()).map((item) => {
    return { ...item, nama: capitalize(item.nama) };
  });

  const kotkab = await data.filter(
    (item) => item.kode.length === 5 && item.kode.startsWith(kodeProvinsi)
  );
  console.log(kotkab);
  if (!kotkab.length) throw new Error("kabupaten/kota tidak ditemukan");

  return kotkab;
}

async function getKecamatanList(kodeKotKab) {
  const data = (await readCSV()).map((item) => {
    return { ...item, nama: capitalize(item.nama) };
  });
  const kecamatan = await data.filter(
    (item) => item.kode.length === 8 && item.kode.startsWith(kodeKotKab)
  );
  console.log(kecamatan);
  if (!kecamatan.length) throw new Error("kecamatan tidak ditemukan");

  return kecamatan;
}

async function getKelDesList(kodeKecamatan) {
  const data = (await readCSV()).map((item) => {
    return { ...item, nama: capitalize(item.nama) };
  });
  const kecamatan = await data.filter(
    (item) => item.kode.length === 13 && item.kode.startsWith(kodeKecamatan)
  );
  console.log(kecamatan);
  if (!kecamatan.length) throw new Error("desa/kelurahan tidak ditemukan");

  return kecamatan;
}

// (async () => console.log(await getKelDesList("32.17.12")))();

module.exports = {
  getProvinsiList,
  getKabupatenKotaList,
  getKecamatanList,
  getKelDesList,
};
