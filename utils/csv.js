const kodeWilayah = require("../databases/kodeWilayah");

const kodeWilayahMap = kodeWilayah.reduce((map, [kode, nama]) => {
  map[kode] = nama;
  return map;
}, {});

function searchKodeWilayah(data) {
  const { prov = "", kotkab = "", kec = "", keldes = "" } = data;

  if (!prov) return "prov dibutuhkan!";

  // Mencari data provinsi
  let provinsiData = [];
  provinsiData = Object.entries(kodeWilayahMap).find(
    ([kode, nama]) =>
      kode.length === 2 && nama.toLowerCase() === prov.toLowerCase()
  );

  if (!provinsiData) {
    provinsiData = Object.entries(kodeWilayahMap).find(
      ([kode, nama]) => kode.length === 2 && nama.includes(prov.toLowerCase())
    );
  }

  if (!provinsiData) return "Provinsi tidak ditemukan!";

  // Filter data kabupaten/kota berdasarkan kode provinsi
  const provinsiDataCollection = Object.entries(kodeWilayahMap).filter(
    ([kode]) => kode.startsWith(provinsiData[0])
  );

  let kotkabData = [];
  let kotkabDataCollection = [];

  if (kotkab) {
    kotkabData = provinsiDataCollection.find(
      ([kode, nama]) =>
        kode.length === 5 && nama.toLowerCase() === kotkab.toLowerCase()
    );

    // jika tidak ada, coba hapus kota jika ada
    if (!kotkabData) {
      kotkabData = provinsiDataCollection.find(
        ([kode, nama]) =>
          kode.length === 5 &&
          nama
            .replace(/^(kota)\s*/i, "")
            .trim()
            .toLowerCase() ===
            kotkab
              .replace(/^(kota)\s*/i, "")
              .trim()
              .toLowerCase()
      );
    }

    // jika tidak ada, coba hapus kab/upaten
    if (!kotkabData) {
      kotkabData = provinsiDataCollection.find(
        ([kode, nama]) =>
          kode.length === 5 &&
          nama
            .replace(/^(kabupaten|kab\.)\s*/i, "")
            .trim()
            .toLowerCase() ===
            kotkab
              .replace(/^(kabupaten|kab\.)\s*/i, "")
              .trim()
              .toLowerCase()
      );
    }

    // jika tidak ada, kosongkan data dengan nilai default
    if (!kotkabData) kotkabData = [];

    // Filter data kecamatan berdasarkan kode kabupaten/kota
    // jika kotkab tidak ada maka akan bagaimana
    kotkabDataCollection = provinsiDataCollection.filter(([kode]) =>
      kode.startsWith(kotkabData[0])
    );
  } else {
    kotkabDataCollection = provinsiDataCollection;
  }

  let kecData = [];
  let kecDataCollection = [];

  if (kec) {
    kecData = kotkabDataCollection.find(
      ([kode, nama]) =>
        kode.length === 8 && nama.toLowerCase() === kec.toLowerCase()
    );

    // jika tidak ada, coba cari jika ada perbedaan spasi
    if (!kecData) {
      kecData = kotkabDataCollection.find(
        ([kode, nama]) =>
          kode.length === 8 &&
          nama.replace(" ", "").toLowerCase() ===
            kec.replace(" ", "").toLowerCase()
      );
    }

    // kosongkan data jika tidak ada
    if (!kecData) kecData = [];

    // Filter data kelurahan/desa berdasarkan kode kecamatan
    kecDataCollection = kotkabDataCollection.filter(([kode]) =>
      kode.startsWith(kecData[0])
    );
  } else {
    kecDataCollection = kotkabDataCollection;
  }

  let keldesData = [];

  if (keldes) {
    keldesData =
      kecDataCollection.find(
        ([kode, nama]) =>
          kode.length === 13 && nama.toLowerCase() === keldes.toLowerCase()
      ) || [];
  }

  const result = {
    provinsi_data: {
      kode: provinsiData[0] || null,
      nama: provinsiData[1] || null,
    },
    kotkab_data: { kode: kotkabData[0] || null, nama: kotkabData[1] || null },
    kec_data: { kode: kecData[0] || null, nama: kecData[1] || null },
    keldes_data: { kode: keldesData[0] || null, nama: keldesData[1] || null },
  };

  if (keldesData.length < 1) {
    if (kecDataCollection && kecDataCollection.length > 0) {
      const [kode, nama] = kecDataCollection.find(
        ([kode]) => kode.length === 13
      );
      result.keldes_data = { kode, nama };
    } else if (kotkabDataCollection && kotkabDataCollection.length > 0) {
      const [kode, nama] = kotkabDataCollection.find(
        ([kode]) => kode.length === 13
      );
      result.keldes_data = { kode, nama };
    } else {
      const [kode, nama] = provinsiDataCollection.find(
        ([kode]) => kode.length === 13
      );
      result.keldes_data = { kode, nama };
    }
  }

  if (kotkabData.length < 1) {
    const kotkabSelected = result?.keldes_data?.kode.slice(0, 5);
    const [kode, nama] = provinsiDataCollection.find(
      ([kode]) => kode === kotkabSelected
    );
    result.kotkab_data = { kode, nama };
  }
  if (kecData.length < 1) {
    const context = result.keldes_data.kode.slice(0, 8);
    const [kode, nama] = provinsiDataCollection.find(
      ([kode]) => kode === context
    );
    result.kec_data = { kode, nama };
  }

  return result;
}

// Contoh penggunaan
// console.log(
//   searchKodeWilayah({
//     prov: "jawa timur",
//     // kotkab: "malang",
//     kec: "nguling",
//     // keldes: "bahagia",
//   })
// );

module.exports = searchKodeWilayah;
