const http = require("http");
const { getProducts, getProductById } = require("./routes/products");

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || "/", "http://localhost");

  if (url.pathname === "/api/products") {
    getProducts(req, res);
    return;
  }

  if (url.pathname.startsWith("/api/products/")) {
    const productId = url.pathname.split("/").pop();
    getProductById(req, res, productId);
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
});

server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
