const { readJsonFile } = require("../utils/fileHandler");

function getProducts(req, res) {
  const products = readJsonFile("products.json");
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(products));
}

function getProductById(req, res, id) {
  const products = readJsonFile("products.json");
  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Product not found" }));
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(product));
}

module.exports = { getProducts, getProductById };
