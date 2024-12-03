function searchTypeID(string) {
  const regex = /^([\w-]+)\.php\?id=(\d+)/;
  const match = string.match(regex);

  if (match) {
    const type = match[1]; // Kelompok pertama menangkap string sebelum ".php"
    const id = match[2]; // Kelompok kedua menangkap angka ID
    return { type, id };
  } else {
    console.log("No match found type id.");
    return null;
  }
}

function searchClosedString(string) {
  const regex = /\(([^)]+)\)/;

  // Ambil teks dalam kurung
  const matches = string.match(regex);

  if (matches) {
    // console.log(matches[1]); // Output: 960 EXP, 10 pcs/quest
    return matches[1];
  } else {
    console.log("Tidak ditemukan teks dalam kurung.");
    return null;
  }
}

function searchAmount(string) {
  // Proses string
  const regex = /-\s*(\d+)x\s*(.+)/i;
  const match = string.match(regex);

  if (match) {
    const amount = parseInt(match[1], 10); // Ambil jumlah
    const name = match[2].trim(); // Ambil nama dan hilangkan spasi ekstra

    const result = { name: name.toLowerCase(), amount };
    return result;
  } else {
    console.log("Format tidak sesuai.");
    return { name: string, amount: "n/a" };
  }
}

const cleanString = (string) => string.replace(/\s+/g, " ").trim();

const searchCategoryAtFirst = (string) => {
  const match = string.match(/^\[(.+)\]\s(.+?)$/);
  if (match) {
    const [_, category, name] = match.map((i) => i.toLowerCase());
    return { category, name };
  }
};

module.exports = {
  searchTypeID,
  searchClosedString,
  searchAmount,
  cleanString,
  searchCategoryAtFirst,
};
