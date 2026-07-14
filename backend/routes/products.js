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
  try {
    const { name, brand, productType, category, price, image, stock, description } = req.body;

    if (!name || !brand || price === undefined) {
      return res.status(400).json({ message: "กรุณากรอกชื่อสินค้า แบรนด์ และราคา" });
    }

    const products = readJsonFile("products.json");

    // Auto-generate next ID
    let nextId = 1;
    if (products.length > 0) {
      const ids = products.map((p) => Number(p.id)).filter((id) => !isNaN(id));
      if (ids.length > 0) {
        nextId = Math.max(...ids) + 1;
      }
    }

    const newProduct = {
      id: nextId,
      name,
      brand,
      type: productType,
      productType, // keep both for compatibility
      category: category || "",
      price: Number(price),
      image: image || "",
      stock: Number(stock) || 0,
      description: description || "",
      highlights: [],
      attributes: {},
      attributesDetails: {}
    };

    products.push(newProduct);
    writeJsonFile("products.json", products);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการสร้างสินค้า" });
  }
}

function updateProduct(req, res) {
  try {
    const { id, name, brand, productType, category, price, image, stock, description } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ไม่พบรหัสสินค้าสำหรับการแก้ไข" });
    }
    if (!name || !brand || price === undefined) {
      return res.status(400).json({ message: "กรุณากรอกชื่อสินค้า แบรนด์ และราคา" });
    }

    const products = readJsonFile("products.json");
    const productIndex = products.findIndex((p) => p.id === Number(id));

    if (productIndex === -1) {
      return res.status(404).json({ message: "ไม่พบสินค้าที่ต้องการแก้ไขในระบบ" });
    }

    const existingProduct = products[productIndex];
    const updatedProduct = {
      ...existingProduct,
      name,
      brand,
      type: productType,
      productType, // keep both for compatibility
      category: category || "",
      price: Number(price),
      image: image || "",
      stock: Number(stock) || 0,
      description: description || "",
    };

    products[productIndex] = updatedProduct;
    writeJsonFile("products.json", products);

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการแก้ไขข้อมูลสินค้า" });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
};
