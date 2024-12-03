const cheerio = require("cheerio");
const axios = require("axios");
const { searchTypeID } = require("./stringSearch");

async function searchMonster(_id) {
  const url = "https://coryn.club/monster.php?id=" + _id; // Ganti dengan URL target
  const result = {};
  const basicInfo = {};

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const cardContainer = $("div.card-container");

    // const cardContainer = cheerio.load(text, null, false);

    const mainContent = cardContainer
      .first()
      .children()
      .children()
      .children("div");

    // console.log("main:", mainContent.length, mainContent.html());

    const name = mainContent.eq(0);
    // console.log("name", name.length, name.html());
    basicInfo.name = name.text().trim().toLowerCase();

    const mainTable = mainContent.eq(1);
    const mainInfo = mainTable.children().children().children();
    // console.log("info", mainInfo.length, mainInfo.html());

    mainInfo.each((index, elemen) => {
      const title = cardContainer.find(elemen).children().first();
      const amount = title.next();
      basicInfo[title.text().trim().toLowerCase()] = amount
        .text()
        .trim()
        .toLowerCase();
    });

    result.basic_info = basicInfo;

    const spawnAt = mainContent.eq(2);
    const at = spawnAt.children();

    // console.log("at", at.length, at.html(), "i");

    const mapName = at.first();
    const value = mapName.next();

    result.spawn_at = {
      name: value.text().trim().toLowerCase(),
      ...searchTypeID(
        value.find("a")?.prop("attributes")?.[0]?.value ?? "null"
      ),
    };

    const listItem = mainContent.eq(4);
    const list = listItem.children().children();

    // console.log("list", list.length, list.html(), "i");
    result.list_drop = [];

    list.each((index, elemen) => {
      const data = {};

      const li = cardContainer.find(elemen).children();
      const attr = li?.find("a")?.prop("attributes")?.[0]?.value ?? "null";
      const { type, id } = searchTypeID(attr);
      data.id = id;
      data.type = type;
      // console.log("attr", attr);
      const name = li.text().replace(/\s+/g, " ").trim();
      const match = name.match(/^\[(.+)\]\s(.+?)$/);

      if (match) {
        data.name = match[2].toLowerCase(); // 'Material'
        data.category = match[1].toLowerCase(); // 'Bird Wing'
      } else {
        console.log("else");
        data.name = name;
      }
      result.list_drop.push(data);
    });

    // console.log(JSON.stringify(result, null, 2));
    return result;
  } catch (e) {
    console.log("error saat ambil monster:\n", e);
  }
}

module.exports = searchMonster;
