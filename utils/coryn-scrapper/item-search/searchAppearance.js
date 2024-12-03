const cheerio = require("cheerio");

function searchAppearance(eachList) {
  const result = {};
  const $list = cheerio.load(eachList.html(), null, false);
  const tr = $list("div:nth-child(2)").find("tbody");
  // console.log("list\n", tr.length);
  tr.each((index, elemen) => {
    const image = $list(elemen).children().last().children();
    const imgurl = {};
    image.each((i, e) => {
      const { value } = $list(e)
        .prop("attributes")
        .find(({ name }) => name === "background");
      const type = ["normal", "light", "heavy"];

      imgurl[type[i]] = value;
    });
    if (index === 0) {
      result.male = imgurl;
    } else {
      result.female = imgurl;
    }
  });
  return result;
}

module.exports = searchAppearance;
