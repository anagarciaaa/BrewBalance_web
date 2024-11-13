const fs = require("fs");
const csv = require("csv-parser");

module.exports = async function () {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream("./drinks.csv")
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};
