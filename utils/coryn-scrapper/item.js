const axios = require("axios");
const cheerio = require("cheerio");
// const util = require("util");

const searchObtainedFrom = require("./item-search/searchObtainedFrom");
// const coryn = require("./item-search/coryn");
const searchUsedFor = require("./item-search/searchUsedFor");
const searchRecipe = require("./item-search/searchRecipe");
const searchStatEffect = require("./item-search/searchStatEffect");
const searchAppearance = require("./item-search/searchAppearance");

async function searchItem(_id) {
  if (!_id) return null;

  const url = "https://coryn.club/item.php?id=" + _id; // Ganti dengan URL target
  const result = {};

  try {
    const basicInfo = {};
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const card = $(".card-container").html();

    if (!card) {
      result.info = "No result found";
      return result;
    }
    const cardContainer = cheerio.load(card, null, false);
    // const cardContainer = cheerio.load(coryn);

    const cardTitle = cardContainer(".card-title").first().text().trim();

    const match = cardTitle.match(/^(.+?)\s\[(.+)\]$/);

    basicInfo.id = _id;

    if (match) {
      basicInfo.name = match[1].toLowerCase(); // 'Bird Wing'
      basicInfo.category = match[2].toLowerCase(); // 'Material'
    }

    const itemProp = cardContainer(":first-child")
      .children("div")
      .eq(1)
      .children();

    // console.log(itemProp.length, "\n", itemProp.html().trim());

    if (itemProp.length > 1) {
      itemProp
        .last()
        .children()
        .children()
        .each((index, element) => {
          const title = cardContainer(element).children().first();
          const description = title.next();
          // console.log("prop:", index, title.html(), description.html());
          basicInfo[title.text().trim().toLowerCase()] = description
            .text()
            .trim()
            .toLowerCase();
        });

      const { value } = itemProp
        .first()
        .find("td")
        .prop("attributes")
        .find(({ name }) => name === "background");
      if (value) basicInfo.img_url = value;
    } else {
      itemProp
        .first()
        .children()
        .children()
        .each((index, element) => {
          const title = cardContainer(element).children().first();
          const description = title.next();
          // console.log("prop:", index, title.html(), description.html());
          basicInfo[title.text().trim().toLowerCase()] = description
            .text()
            .trim()
            .toLowerCase();
        });
    }

    result.basic_info = basicInfo;

    const additionalData = cardContainer("ul.card-attach-bottom");

    const list = additionalData.children("li");

    // console.log("list length:", list.length);

    list.each((index, element) => {
      const eachList = cardContainer(element);
      const title = eachList.children().first().text().trim();
      // console.log("====title", title);

      switch (title.toLowerCase()) {
        case "obtained from":
          result.obtained_from = searchObtainedFrom(eachList);
          break;
        case "used for":
          result.used_for = searchUsedFor(eachList);
          break;
        case "recipe":
          result.recipe = searchRecipe(eachList);
          break;
        case "stat/effect":
          result.stat_effect = searchStatEffect(eachList);
          break;
        case "appearance":
          result.appearance = searchAppearance(eachList);
          break;
        default:
          console.log(
            "===========================\n",
            title,
            "\n---------------------------"
          );
          break;
      }
    });

    // console.log(util.inspect(result, { depth: null, colors: true }));
    return result;
  } catch (error) {
    console.error("Error saat scraping:", error);
  }
}

// function callWithRandomNumbers(callback) {
//   let count = 0;

//   const interval = setInterval(() => {
//     if (count >= 5) {
//       clearInterval(interval); // Hentikan loop setelah 10 kali
//       return;
//     }

//     const randomNumber = Math.floor(Math.random() * 8036) + 1; // Angka random 1-8036
//     callback(randomNumber); // Panggil fungsi dengan parameter randomNumber
//     count++;
//   }, 2000); // Jeda 2 detik
// }

// Contoh penggunaan:
// callWithRandomNumbers((number) => {
//   scrapeWebsite(number);
//   console.log("1111111111: ", number);
// });
// scrapeWebsite(479);

module.exports = searchItem;
