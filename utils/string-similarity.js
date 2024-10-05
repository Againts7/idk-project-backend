const stringSimilarity = require("string-similarity");

function searchSimilarity(text, array) {
  if (!text || array?.length < 1) return;
  const matches = stringSimilarity.findBestMatch(text, array);
  const skor = matches.bestMatch.rating;
  // console.log(matches.bestMatch.target, skor);
  if (skor > 0.7) return matches.bestMatch.target;
  return null;
}

module.exports = searchSimilarity;
