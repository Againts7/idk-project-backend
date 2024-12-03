const { default: axios } = require("axios");
const cheerio = require("cheerio");
const {
  cleanString,
  searchTypeID,
  searchCategoryAtFirst,
} = require("./stringSearch");

async function searchMap(_id) {
  const url = "https://coryn.club/map.php?id=" + _id; // Ganti dengan URL target

  try {
    const result = {};
    const { data } = await axios.get(url);
    // const $ = cheerio.load(data);

    const $card = cheerio.load(data);

    const cardContainer = $card("div.card-container-1").children().children();

    console.log("card-container", cardContainer.length, cardContainer.html());

    const mapName = cardContainer.first();
    // console.log("mapName", mapName.length, mapName.html());

    const dataCard = cardContainer.last().children();

    const monsterNPC = [];

    const listMonsterNPC = dataCard.eq(0).children();
    // monsterNPC.title = listMonsterNPC.first().text().trim();
    const dataList = listMonsterNPC.last().children();

    dataList.each((index, elemen) => {
      const name = $card(elemen);
      const attr = searchTypeID(
        name?.find("a")?.prop("attributes")?.[0]?.value ?? ""
      );
      const nameString = searchCategoryAtFirst(cleanString(name.text().trim()));

      if (attr) {
        monsterNPC.push({
          id: attr.id,
          name: nameString?.name ?? cleanString(name.text().trim()),
          category: nameString?.category ?? "",
          type: attr.type,
        });
      } else {
        monsterNPC.push({
          name: nameString?.name ?? cleanString(name.text().trim()),
          category: nameString?.category ?? "",
        });
      }
    });

    // console.log("list mob:", monsterNPC);

    const listObtainable = dataCard.eq(1).children();

    const obtainableTitle = listObtainable.first();

    console.log(
      "obtainableTitle",
      obtainableTitle.length,
      obtainableTitle.html()
    );

    const list = listObtainable.last().children();

    // console.log("listTitle", listTitle.length, listTitle.html());

    const listItem = list.eq(1).children().children();
    // console.log("listItem", listItem.length, listItem.html());

    const listItemResult = [];

    listItem.each((index, elemen) => {
      const li = $card(elemen).children();

      // console.log(index, "list npc/drop", li.length, li.prop("attributes"));

      const listTitle = li.first();
      const listItemInner = listTitle.next().children();

      const listInnerResult = [];

      listItemInner.each((index, elemen) => {
        const item = $card(elemen).first();
        const { type, id } = searchTypeID(
          item.find("a").prop("attributes")[0].value
        );
        const dye = item.next();
        const nameString = searchCategoryAtFirst(
          cleanString(item.text().trim())
        );
        listInnerResult.push({
          id,
          name: nameString?.name ?? cleanString(item.text().trim()),
          type,
          category: nameString?.category ?? "",
        });
      });

      const nameString = searchCategoryAtFirst(
        cleanString(listTitle.text().trim())
      );

      listItemResult.push({
        from: nameString?.name ?? cleanString(listTitle.text().trim()),
        category: nameString?.category ?? "",
        items: listInnerResult,
      });
    });
    const basicInfo = {};

    basicInfo.id = _id;
    basicInfo.map_name = mapName.text().trim().toLowerCase();

    result.basic_info = basicInfo;
    result.mob_list = monsterNPC;
    result.obtainable = listItemResult;

    // console.log("result\n", JSON.stringify(result, null, 2));
    return result;
  } catch (e) {
    console.log("error cari map:", e);
  }
}

module.exports = searchMap;
