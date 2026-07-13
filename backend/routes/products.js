const { readJsonFile, writeJsonFile } = require("../utils/fileHandler");

function getProducts(req, res) {
  const products = readJsonFile("products.json");
  res.json(products);
}

function getProductById(req, res) {
  const products = readJsonFile("products.json");

  const product = products.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.json(product);
}

module.exports = {
  getProducts,
  getProductById,
};
