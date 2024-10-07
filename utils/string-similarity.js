const stringSimilarity = require("string-similarity");

function searchSimilarity(text, array) {
  if (!text || array?.length < 1) return;
  const matches = stringSimilarity.findBestMatch(text, array);
  const skor = matches.bestMatch.rating;
  // if (text === "sukamulya") {
  //   console.log(matches.bestMatch.target, skor);
  // }
  if (skor > 0.7) {
    console.log(matches.bestMatch.target, skor);
    return matches.bestMatch.target;
  }
  return null;
}

module.exports = searchSimilarity;
