// const kodeWilayah = require("../databases/kodeWilayah");

const fs = require("fs");
const csv = require("csv-parser");
const chalk = require("chalk");
const searchSimilarity = require("./string-similarity");
const searchProv = require("./csv/searchProv");
const searchKotKab = require("./csv/searchKotkab");
const searchKec = require("./csv/searchKec");
const searchKeldes = require("./csv/searchKeldes");

async function readCSV() {
  const kodeWilayahMap = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      require("path").join(__dirname, "../databases/base.csv")
    )
      .pipe(csv())
      .on("data", (row) => {
        kodeWilayahMap.push(row); // Menambahkan setiap baris data ke array
      })
      .on("end", () => {
        //console.log("read done");
        resolve(kodeWilayahMap);
      })
      .on("error", reject);
  });
}

async function getRandomKodeWilayah(kodeInput) {
  const kodeWilayahList = (await readCSV()).map((item) => {
    return { ...item, nama: item.nama.toLowerCase() };
  });

  //console.log("get random kode:", kodeInput);

  return kodeWilayahList.find(
    ({ kode }) => kode.length === 13 && kode.startsWith(kodeInput)
  );
}

function compareData(forCompare, keldesDitemukan, addReport, context) {
  if (keldesDitemukan.length < 1) {
    addReport("data komparasi tidak valid: " + context);
    return [];
  }

  const kodeForCompare = forCompare.map((item) => item.kode);

  const relasi = keldesDitemukan.filter((item) =>
    kodeForCompare.some((i) => item.kode.startsWith(i))
  );

  if (relasi && relasi.length === 1) {
    addReport(`komparasi antara ${context} berhasil. mengembalikan nilai...`);
    return relasi;
  } else if (relasi.length > 0) {
    addReport(
      `komparasi antara ${context} ditemukan sebanyak: ` + relasi.length
    );
    console.log(chalk.bgCyan(`compare result ${context}:`), relasi);
  } else {
    addReport(`komparasi antara ${context} tidak ditemukan`);
  }

  return relasi;
}

async function searchKodeWilayah(data) {
  let { prov = "", kotkab = "", kec = "", keldes = "" } = data;

  prov = prov.toLowerCase().trim();
  kotkab = kotkab.toLowerCase().trim();
  kec = kec.toLowerCase().trim();
  keldes = keldes.toLowerCase().trim();

  console.log("=====", keldes, kec, kotkab, prov, "=====");

  let report = "";

  const atleast = [];

  function addReport(text) {
    console.log(
      text.includes("berhasil")
        ? chalk.bgWhite("Info:")
        : text.includes("komparasi")
        ? chalk.bgYellow("Info:")
        : text.includes("input")
        ? chalk.bgRed("Info:")
        : chalk.bgGreen("Info:"),
      text
    );
    report += `\n${text}`;
  }

  try {
    const kodeWilayahList = (await readCSV()).map((item) => {
      return { ...item, nama: item.nama.toLowerCase() };
    });

    if (kodeWilayahList.length < 1) throw new Error("data tidak terbaca!");

    // mencari masing-masing dari parameter

    let provDitemukan = [];

    if (prov) {
      provDitemukan = searchProv(prov, kodeWilayahList, addReport);
    } else {
      addReport("tidak terdapat prov input");
    }

    let kotkabDitemukan = [];

    if (kotkab) {
      if (prov && provDitemukan.length > 0) {
        const kodeList = provDitemukan.map((item) => item.kode);
        const prov_kotkab = kodeWilayahList.filter(
          (item) =>
            item.kode.length === 5 &&
            kodeList.some((i) => item.kode.startsWith(i))
        );
        kotkabDitemukan = searchKotKab(kotkab, prov_kotkab, addReport);
      } else {
        kotkabDitemukan = searchKotKab(kotkab, kodeWilayahList, addReport);
      }
    } else {
      addReport("tidak terdapat kotkab input");
    }

    let kecDitemukan = [];

    if (kec) {
      if (provDitemukan.length || kotkabDitemukan.length) {
        if (kotkabDitemukan.length > 0) {
          const kodeList = kotkabDitemukan.map((item) => item.kode);
          const kotkab_kec = kodeWilayahList.filter(
            ({ kode }) =>
              kode.length === 8 && kodeList.some((i) => kode.startsWith(i))
          );
          if (kotkab_kec) kecDitemukan = searchKec(kec, kotkab_kec, addReport);
        } else {
          const kodeList = provDitemukan.map((item) => item.kode);
          const prov_kec = kodeWilayahList.filter(
            ({ kode }) =>
              kode.length === 8 && kodeList.some((i) => kode.startsWith(i))
          );
          if (prov_kec) kecDitemukan = searchKec(kec, prov_kec, addReport);
        }
      } else {
        kecDitemukan = searchKec(kec, kodeWilayahList, addReport);
      }
    } else {
      addReport("tidak terdapat kec input");
    }

    // ============ cari keldes ============

    let keldesDitemukan = [];

    if (keldes) {
      if (
        provDitemukan.length ||
        kotkabDitemukan.length ||
        kecDitemukan.length
      ) {
        if (kecDitemukan.length > 0) {
          console.log(chalk.bgGreen("keldes: kec ditemukan"));
          const kodeList = kecDitemukan.map((item) => item.kode);
          const kel_keldes = kodeWilayahList.filter(
            ({ kode }) =>
              kode.length === 13 && kodeList.some((i) => kode.startsWith(i))
          );
          if (kel_keldes) {
            keldesDitemukan = searchKeldes(keldes, kel_keldes, addReport);
          }
        } else if (keldesDitemukan.length === 0 && kotkabDitemukan.length > 0) {
          console.log(chalk.bgGreen("keldes: kotkab ditemukan"));

          const kodeList = kotkabDitemukan.map((item) => item.kode);
          const kotkab_keldes = kodeWilayahList.filter(
            ({ kode }) =>
              kode.length === 13 && kodeList.some((i) => kode.startsWith(i))
          );
          if (kotkab_keldes) {
            keldesDitemukan = searchKeldes(keldes, kotkab_keldes, addReport);
          }
        } else {
          const kodeList = provDitemukan.map((item) => item.kode);
          const prov_keldes = kodeWilayahList.filter(
            ({ kode }) =>
              kode.length === 13 && kodeList.some((i) => kode.startsWith(i))
          );
          if (prov_keldes) {
            keldesDitemukan = searchKeldes(keldes, prov_keldes, addReport);
          }
        }
      } else {
        keldesDitemukan = searchKeldes(keldes, kodeWilayahList, addReport);
      }
    } else {
      addReport("tidak terdapat keldes input");
    }

    // mengkompare masing masing hasil #####################################

    let compare_prov_kotkab = [];

    if (prov && kotkab) {
      compare_prov_kotkab = compareData(
        provDitemukan,
        kotkabDitemukan,
        addReport,
        "prov-kotkab"
      );
    }

    if (compare_prov_kotkab.length === 1 && !keldes && !kec) {
      //console.log(typeof compare_prov_kotkab, "compare_prov_kotkab");
      return compare_prov_kotkab;
    }
    if (compare_prov_kotkab.length > 1) {
      atleast.push({
        context: compare_prov_kotkab,
        length: compare_prov_kotkab.length,
      });
    }

    // ###############################################################

    let compare_prov_kec = [];

    if (prov && kec) {
      compare_prov_kec = compareData(
        provDitemukan,
        kecDitemukan,
        addReport,
        "prov-kec"
      );
    }

    if (compare_prov_kec.length === 1) {
      //console.log(typeof compare_prov_kec, "compare_prov_kec");
      return compare_prov_kec;
    }
    if (compare_prov_kec.length > 1) {
      atleast.push({
        context: compare_prov_kec,
        length: compare_prov_kec.length,
      });
    }

    // #########################################################

    let compare_prov_keldes = [];

    if (prov && keldes) {
      compare_prov_keldes = compareData(
        provDitemukan,
        keldesDitemukan,
        addReport,
        "prov-keldes"
      );
    }

    if (compare_prov_keldes.length === 1) {
      //console.log(typeof compare_prov_keldes, "compare_prov_keldes");
      return compare_prov_keldes;
    }
    if (compare_prov_keldes.length > 1) {
      atleast.push({
        context: compare_prov_keldes,
        length: compare_prov_keldes.length,
      });
    }

    // #########################################################

    let compare_kotkab_kec = [];

    if (kotkab && kec) {
      compare_kotkab_kec = compareData(
        kotkabDitemukan,
        kecDitemukan,
        addReport,
        "kotkab-kec"
      );
    }

    if (compare_kotkab_kec.length === 1) {
      //console.log(typeof compare_kotkab_kec, "compare_kotkab_kec");
      return compare_kotkab_kec;
    }
    if (compare_kotkab_kec.length > 1) {
      atleast.push({
        context: compare_kotkab_kec,
        length: compare_kotkab_kec.length,
      });
    }

    // ######################################################

    let compare_kotkab_keldes = [];

    if (kotkab && keldes) {
      compare_kotkab_keldes = compareData(
        kotkabDitemukan,
        keldesDitemukan,
        addReport,
        "kotkab-keldes"
      );
    }

    if (compare_kotkab_keldes.length === 1) {
      console.log(typeof compare_kotkab_keldes, "compare_kotkab_keldes");
      return compare_kotkab_keldes;
    }
    if (compare_kotkab_keldes.length > 1) {
      atleast.push({
        context: compare_kotkab_keldes,
        length: compare_kotkab_keldes.length,
      });
    }

    // #########################################################

    let compare_kec_keldes = [];

    if (kec && keldes) {
      compare_kec_keldes = compareData(
        kecDitemukan,
        keldesDitemukan,
        addReport,
        "kec-keldes"
      );
    }

    if (compare_kec_keldes.length === 1) {
      //console.log(typeof compare_kec_keldes, "compare_kec_keldes");
      return compare_kec_keldes;
    }

    if (compare_kec_keldes.length > 1) {
      atleast.push({
        context: compare_kec_keldes,
        length: compare_kec_keldes.length,
      });
    }

    // #################################################################

    console.log(chalk.bgRedBright("masih belum nemu :("));

    const nonZero = atleast.filter(({ length }) => length !== 0);

    // console.log("nonzero", nonZero);

    if (nonZero && nonZero.length > 0) {
      const minim = Math.min(...nonZero.map((item) => item.length));

      const tersedikit = nonZero.filter((item) => item.length === minim)[0]
        .context;

      if (tersedikit.length > 0) {
        console.log("tersedikit", tersedikit);
        const cobaKeldes = tersedikit.filter(
          ({ kode, nama }) => kode.length === 13 && nama === keldes
        );
        if (cobaKeldes.length === 1) return cobaKeldes;

        let cobaKec = searchKec(kec, tersedikit, addReport);
        if (cobaKec && cobaKec.length === 1) {
          return cobaKec;
        }
        if (cobaKec && cobaKec.length > 1) {
          cobaKec = tersedikit.filter(({ nama }) => nama === kec);
        }
        if (cobaKec && cobaKec.length === 1) {
          return cobaKec;
        }
        if (cobaKec && cobaKec.length > 1) {
          const mirip = searchSimilarity(
            kec,
            cobaKec.map((item) => item.nama)
          );
          if (mirip) return cobaKec.find(({ nama }) => nama === mirip);
        }

        const cobaKotkab = searchKotKab(kotkab, tersedikit, addReport);

        if (cobaKotkab && cobaKotkab.length) {
          const mirip = searchSimilarity(
            kotkab,
            cobaKotkab.map((item) => item.nama)
          );
          console.log("mirip", mirip);
          if (mirip) return cobaKotkab.find(({ nama }) => nama === mirip);
        }

        const cobaProv = searchProv(prov, tersedikit, addReport);
        if (cobaProv) {
          const mirip = searchSimilarity(
            prov,
            cobaProv.map((item) => item.nama)
          );
          if (mirip) return cobaProv.find(({ nama }) => nama === mirip);
        }

        console.log(cobaKeldes, cobaKec, cobaKotkab, cobaProv);

        const namaarray = tersedikit.map(({ nama }) => nama);
        const mirip = searchSimilarity(keldes, namaarray);
        const cobalagi = tersedikit.find(({ nama }) => nama === mirip);
        if (cobalagi) {
          console.log(typeof cobalagi, "cobalagi");
          return [cobalagi];
        }
      }
    }

    console.log(chalk.bgMagenta("akhirnya sampai ujung :3"));

    const lastpilihan = prov || kotkab || kec || keldes;

    console.log(chalk.bgMagenta("last pilihan"), lastpilihan);

    const lastarray =
      (keldesDitemukan.length > 0 ? keldesDitemukan : false) ||
      (kecDitemukan.length > 0 ? kecDitemukan : false) ||
      (kotkabDitemukan.length > 0 ? kotkabDitemukan : false) ||
      (provDitemukan.length > 0 ? provDitemukan : false);

    //console.log(chalk.bgMagenta("last array"), lastarray);

    if (lastarray.length === 1) return lastarray;

    const atleastNama = lastarray.map((item) => item.nama);

    const similarity = searchSimilarity(lastpilihan, atleastNama);

    if (similarity) {
      const lastkeldes = lastarray.find((item) => item.nama === similarity);
      if (lastkeldes) {
        //console.log("lastkeldes", lastkeldes);
        return [lastkeldes];
      }
    } else {
      addReport("gagal mencocokan kemiripan");
    }

    return "gagal mendapatkan kode wilayah" + report;
  } catch (e) {
    console.error(e);
  }
}

// Contoh penggunaan
// (async () => {
//   const res = await searchKodeWilayah({
//     prov: "Jawa Barat",
//     kotkab: "Bandung Barat",
//     // kec: "Ngabang",
//     keldes: "Sukamulya",
//   });

//   //console.log(res);

//   let res2 = "";
//   if (res && res[0]?.kode?.length !== 13) {
//     res2 = [await getRandomKodeWilayah(res[0].kode)];
//     //console.log(res2);
//   }

//   console.log(chalk.bgRed("result"), res, res2);
// })();

module.exports = { searchKodeWilayah, getRandomKodeWilayah, readCSV };
