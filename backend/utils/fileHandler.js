const fs = require("fs");
const path = require("path");

function readJsonFile(fileName) {
  const filePath = path.join(__dirname, "..", "data", fileName);
  const rawData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(rawData);
}

module.exports = { readJsonFile };
