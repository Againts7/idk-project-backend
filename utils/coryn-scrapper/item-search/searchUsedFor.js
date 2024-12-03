const cheerio = require("cheerio");
const { searchTypeID, searchClosedString } = require("../stringSearch");

function searchUsedFor(eachList) {
  const result = [];

  const $data = cheerio.load(eachList.html(), null, false);
  const title = $data("div").first();
  const data = title.next();

  const list = data.children();

  // Variabel untuk menyimpan hasil split
  let sections = [];
  let currentSection = null;

  // Iterasi elemen dalam container
  list.each((index, elem) => {
    if ($data(elem).is("p.card-title")) {
      // Jika elemen adalah <p>, mulai bagian baru
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: $data(elem).text().trim(),
        content: [],
      };
    } else {
      // Jika bukan <p>, tambahkan ke bagian saat ini
      if (currentSection) {
        currentSection.content.push($data.html(elem).trim());
      }
    }
  });

  // Tambahkan bagian terakhir jika ada
  if (currentSection) {
    sections.push(currentSection);
  }

  // Cetak hasil split
  // sections.forEach((section, idx) => {
  //   console.log(`Section ${idx + 1}:`);
  //   console.log(`Title: ${section.title}`);
  //   console.log(`Content:`);
  //   section.content.forEach((content) => console.log(content));
  //   console.log("---");
  // });

  if (sections.length) {
    sections.forEach(({ title, content }) => {
      const cont = content.join("\n");
      const $data = cheerio.load(cont, null, false);
      const list = $data("li").children();
      const res = { for: title.toLowerCase(), item: [] };
      list.each((index, elemen) => {
        const typeID = $data(elemen).prop("attributes")[0].value;
        const { type, id } = searchTypeID(typeID);
        const name = $data(elemen).text().trim().toLowerCase();
        const require = searchClosedString(
          $data(elemen).parent().text().trim().toLowerCase()
        );
        res.item.push({ name, type, id, require });
      });
      result.push(res);
    });
    // console.log("result:\n", JSON.stringify(result, null, 2));
  }

  return result;
}

module.exports = searchUsedFor;
