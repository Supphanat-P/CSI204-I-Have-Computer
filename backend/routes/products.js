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

function createProduct(req, res) {
  const products = readJsonFile("products.json");
  
  const { name, brand, price, stock, productType, category, image, description, attributes, attributesDetails } = req.body;
  if (!name || !brand || price === undefined) {
    return res.status(400).json({ message: "กรุณากรอกชื่อสินค้า แบรนด์ และราคา" });
  }

  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  
  const newProduct = {
    id: newId,
    name,
    brand,
    price: Number(price),
    stock: Number(stock) || 0,
    productType: productType || "",
    category: category || "",
    image: image || "",
    description: description || "",
    type: productType || "",
    attributes: attributes || {},
    attributesDetails: attributesDetails || {}
  };

  products.push(newProduct);
  writeJsonFile("products.json", products);

  res.status(201).json({ message: "เพิ่มสินค้าสำเร็จ", product: newProduct });
}

function updateProduct(req, res) {
  const products = readJsonFile("products.json");
  
  const { id, name, brand, price, stock, productType, category, image, description, attributes, attributesDetails } = req.body;
  
  if (!id) {
    return res.status(400).json({ message: "ไม่ระบุ ID สินค้า" });
  }

  const index = products.findIndex(p => p.id === Number(id));
  if (index === -1) {
    return res.status(404).json({ message: "ไม่พบสินค้าที่ต้องการแก้ไข" });
  }

  const updatedProduct = {
    ...products[index],
    name: name !== undefined ? name : products[index].name,
    brand: brand !== undefined ? brand : products[index].brand,
    price: price !== undefined ? Number(price) : products[index].price,
    stock: stock !== undefined ? Number(stock) : products[index].stock,
    productType: productType !== undefined ? productType : products[index].productType,
    category: category !== undefined ? category : products[index].category,
    image: image !== undefined ? image : products[index].image,
    description: description !== undefined ? description : products[index].description,
    type: productType !== undefined ? productType : products[index].type,
    attributes: attributes !== undefined ? attributes : products[index].attributes,
    attributesDetails: attributesDetails !== undefined ? attributesDetails : products[index].attributesDetails
  };

  products[index] = updatedProduct;
  writeJsonFile("products.json", products);

  res.json({ message: "แก้ไขสินค้าสำเร็จ", product: updatedProduct });
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
};
