const cheerio = require("cheerio");
const { searchTypeID, searchAmount } = require("../stringSearch");

function searchRecipe(eachList) {
  const result = {};
  const $list = cheerio.load(eachList.html(), null, false);

  const data = $list("div:nth-child(2)").children();

  data.each((index, element) => {
    const title = $list(element).find("p").eq(0).text().trim();
    const description = $list(element).find("div").text().trim();
    if (title === "Materials") {
      const mat = $list(element).find("ul").children();
      // console.log("mat:", mat.length);
      const m = [];
      mat.each((index, element) => {
        const f = {};
        const item = $list(element);
        const attr = item.children().prop("attributes");
        const { name, amount } = searchAmount(item.text().trim().toLowerCase());
        f.name = name;
        f.amount = amount;

        if (attr && attr.length) {
          const { type, id } = searchTypeID(attr[0].value);
          f.id = id;
          f.type = type;
        }
        m.push(f);
      });
      result[title.toLowerCase()] = m;
    } else {
      if (title.length && description) {
        result[title.toLowerCase()] = description.toLowerCase();
      }
    }
  });

  // console.log(data.length, data.html());
  return result;
}

module.exports = searchRecipe;
