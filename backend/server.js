const http = require("http");
const { getProducts, getProductById } = require("./routes/products");
const { registerUser, loginUser, updateProfile } = require("./routes/auth");
const { authMiddleware } = require("./middleware/authMiddleware");

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, POST");

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

  if (url.pathname === "/api/register" && req.method === "POST") {
    registerUser(req, res);
    return;
  }

  if (url.pathname === "/api/login" && req.method === "POST") {
    loginUser(req, res);
    return;
  }

  if (url.pathname === "/api/profile/update" && req.method === "POST") {
    authMiddleware(req, res, () => {
      updateProfile(req, res);
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
});

server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});


