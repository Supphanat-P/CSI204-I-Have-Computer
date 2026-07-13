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

<<<<<<< HEAD
// Helper to parse request body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => { body += chunk.toString(); });
    req.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch (err) { reject(err); }
    });
  });
}

async function createProduct(req, res) {
  try {
    // Admin guard
    if (!req.user || req.user.role !== "admin") {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถเพิ่มสินค้าได้" }));
      return;
    }

    const body = await parseBody(req);
    const { name, brand, productType, category, price, image, stock, description, highlights, specs } = body;

    if (!name || !brand || !price) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "กรุณากรอกข้อมูลสินค้าให้ครบถ้วน (ชื่อ, แบรนด์, ราคา)" }));
      return;
    }

    const products = readJsonFile("products.json");
    const maxId = products.reduce((max, p) => Math.max(max, p.id || 0), 0);

    const newProduct = {
      id: maxId + 1,
      name,
      brand,
      productType: productType || "",
      category: category || "",
      price: Number(price),
      image: image || "",
      stock: Number(stock) || 0,
      description: description || "",
      highlights: highlights || [],
      specs: specs || {},
    };

    products.push(newProduct);
    writeJsonFile("products.json", products);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, product: newProduct }));
  } catch (error) {
    console.error("Create product error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }));
  }
}

async function updateProduct(req, res) {
  try {
    // Admin guard
    if (!req.user || req.user.role !== "admin") {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถแก้ไขสินค้าได้" }));
      return;
    }

    const body = await parseBody(req);
    const { id, name, brand, productType, category, price, image, stock, description, highlights, specs } = body;

    if (!id) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "ไม่พบ ID สินค้า" }));
      return;
    }

    const products = readJsonFile("products.json");
    const productIndex = products.findIndex((p) => p.id === Number(id));

    if (productIndex === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "ไม่พบสินค้าในระบบ" }));
      return;
    }

    const updatedProduct = {
      ...products[productIndex],
      name: name !== undefined ? name : products[productIndex].name,
      brand: brand !== undefined ? brand : products[productIndex].brand,
      productType: productType !== undefined ? productType : products[productIndex].productType,
      category: category !== undefined ? category : products[productIndex].category,
      price: price !== undefined ? Number(price) : products[productIndex].price,
      image: image !== undefined ? image : products[productIndex].image,
      stock: stock !== undefined ? Number(stock) : products[productIndex].stock,
      description: description !== undefined ? description : products[productIndex].description,
      highlights: highlights !== undefined ? highlights : products[productIndex].highlights,
      specs: specs !== undefined ? specs : products[productIndex].specs,
    };

    products[productIndex] = updatedProduct;
    writeJsonFile("products.json", products);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, product: updatedProduct }));
  } catch (error) {
    console.error("Update product error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }));
  }
}

module.exports = { getProducts, getProductById, createProduct, updateProduct };
=======
module.exports = {
  getProducts,
  getProductById,
};
>>>>>>> main
