const cheerio = require("cheerio");
const { searchTypeID } = require("../stringSearch");

function searchStatEffect(eachList) {
  const $list = cheerio.load(eachList.html(), null, false);
  // const $list = cheerio.load(text, null, false);
  const table = $list("div:nth-child(2)").children();

  const header = table.first();
  const content = header.nextAll();

  const result = [];

  // console.log("header:", header.children().text());

  content.each((index, elemen) => {
    const stat = $list(elemen).children().first();
    const amount = stat.next();

    // console.log("stat:", stat.text(), "\namount:", amount.text());
    if (stat.text().trim().toLowerCase() === "upgrade for") {
      const attr = amount.find("a").prop("attributes")[0].value;
      const { type, id } = searchTypeID(attr);
      result.push({
        stat: stat.text().trim().toLowerCase(),
        amount: {
          name: amount.text().trim().toLowerCase(),
          id,
          type,
        },
      });
    } else {
      result.push({
        stat: stat.text().trim().toLowerCase(),
        amount: amount.text().trim().toLowerCase(),
      });
    }
  });

  // console.log(result);
  return result;
}

module.exports = searchStatEffect;
