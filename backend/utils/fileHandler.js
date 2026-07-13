const fs = require("fs");
const path = require("path");

function readJsonFile(fileName) {
  const filePath = path.join(__dirname, "..", "data", fileName);
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const rawData = fs.readFileSync(filePath, "utf8").trim();
    if (!rawData) {
      return [];
    }
    return JSON.parse(rawData);
  } catch (err) {
    console.error("Error reading file:", fileName, err);
    return [];
  }
}

function writeJsonFile(fileName, data) {
  const filePath = path.join(__dirname, "..", "data", fileName);
  try {
    // Ensure data folder exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing file:", fileName, err);
  }
}

module.exports = { readJsonFile, writeJsonFile };

