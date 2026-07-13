<<<<<<< HEAD
const http = require("http");
const { getProducts, getProductById, createProduct, updateProduct } = require("./routes/products");
=======
const express = require("express");
const cors = require("cors");

const { getProducts, getProductById } = require("./routes/products");
>>>>>>> main
const { registerUser, loginUser, updateProfile } = require("./routes/auth");
const { authMiddleware } = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

<<<<<<< HEAD
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT");
=======
app.use(cors());
app.use(express.json());
>>>>>>> main

app.get("/api/products", getProducts);
app.get("/api/products/:id", getProductById);

app.post("/api/register", registerUser);
app.post("/api/login", loginUser);
app.post("/api/profile/update", authMiddleware, updateProfile);

<<<<<<< HEAD
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

  if (url.pathname === "/api/products/create" && req.method === "POST") {
    authMiddleware(req, res, () => {
      createProduct(req, res);
    });
    return;
  }

  if (url.pathname === "/api/products/update" && req.method === "POST") {
    authMiddleware(req, res, () => {
      updateProduct(req, res);
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
=======
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
>>>>>>> main
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
