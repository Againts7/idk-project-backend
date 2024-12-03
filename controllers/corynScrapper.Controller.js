const searchItem = require("../utils/coryn-scrapper/item");
const searchMap = require("../utils/coryn-scrapper/map");
const searchMonster = require("../utils/coryn-scrapper/monster");

async function getByID(req, res, next) {
  const { from, id } = req.query;

  try {
    let result = { info: "no result" };

    switch (from) {
      case "item":
        result = await searchItem(id);
        break;
      case "monster":
        result = await searchMonster(id);
        break;
      case "map":
        result = await searchMap(id);
        break;
      default:
        break;
    }
    return res.json(result);
  } catch (e) {
    e.message = "error saat scrapping";
    next(e);
  }
}

module.exports = { getByID };
