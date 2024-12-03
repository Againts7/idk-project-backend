const cheerio = require("cheerio");

function searchObtainedFrom(eachList) {
  const result = [];
  // console.log("===>", "obtained from");
  const $table = cheerio.load(eachList.children().eq(1).html(), null, false);

  const tableHeader = $table(":first").children("div").children();

  const header = tableHeader.map((index, element) => {
    // console.log("elemen", $table(element).text());
    return $table(element).text();
  });

  result.push(header);

  const tableContent = $table(":eq(1)").children().children();

  const content = tableContent
    .map((index, element) => {
      const name = $table(element).children().first();
      const dye = name.next();
      const map = dye.next();

      const nameurl = name.children().prop("attributes")?.[0].value;

      const regex = /^([\w-]+)\.php\?id=(\d+)/;

      const match = nameurl.match(regex);

      const nameID = {};

      if (match) {
        const type = match[1]; // Kelompok pertama menangkap string sebelum ".php"
        const id = match[2]; // Kelompok kedua menangkap angka ID
        nameID.id = id;
        nameID.type = type;
      }

      const mapurl = map?.find("a")?.prop("attributes")?.[0]?.value ?? "null";

      // console.log("mapurl", mapurl);

      const matchmapurl = mapurl.match(regex);

      const mapID = {};

      if (matchmapurl) {
        const type = matchmapurl[1]; // Kelompok pertama menangkap string sebelum ".php"
        const id = matchmapurl[2]; // Kelompok kedua menangkap angka ID
        mapID.id = id;
        mapID.type = type;
      }

      return {
        from: {
          name: name
            .text()
            .trim()
            .replace(/[\t\n]+/g, " ")
            .toLowerCase(),
          id: nameID.id || null,
          type: nameID.type || null,
        },
        dye: dye.text().trim(),
        map: {
          name: map.text().trim().toLowerCase(),
          id: mapID.id || null,
          type: mapID.type,
        },
      };
    })
    .get();

  // console.log(content);
  return content;
}

module.exports = searchObtainedFrom;
