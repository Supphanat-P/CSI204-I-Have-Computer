const crypto = require("crypto");
const JWT_SECRET = "super-secret-key-123456";

// Helper to encode string to base64url
function base64url(str, encoding = "utf8") {
  return Buffer.from(str, encoding).toString("base64url");
}

// Function to generate JWT Token
function signJwt(payload) {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const base64Payload = base64url(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${base64Payload}`)
    .digest("base64url");
  return `${header}.${base64Payload}.${signature}`;
}

// Function to verify JWT Token
function verifyJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signature] = parts;

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    // Decode payload
    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf8");
    return JSON.parse(payloadJson);
  } catch (err) {
    return null;
  }
}

// Middleware to protect routes
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "กรุณาเข้าสู่ระบบก่อนใช้งาน" }));
    return;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "รูปแบบ Token ไม่ถูกต้อง" }));
    return;
  }

  const token = parts[1];
  const decoded = verifyJwt(token);

  if (!decoded) {
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Token ไม่ถูกต้องหรือหมดอายุ" }));
    return;
  }

  req.user = decoded; // Attach user payload to request
  if (typeof next === "function") {
    next();
  }
}

// Middleware to protect admin routes
function adminMiddleware(req, res, next) {
  if (!req.user) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "กรุณาเข้าสู่ระบบก่อนใช้งาน" }));
    return;
  }

  if (req.user.role !== "admin") {
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "ไม่มีสิทธิ์เข้าถึง (สำหรับ Admin เท่านั้น)" }));
    return;
  }

  if (typeof next === "function") {
    next();
  }
}

// Middleware to protect manager and admin routes
function managerMiddleware(req, res, next) {
  if (!req.user) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "กรุณาเข้าสู่ระบบก่อนใช้งาน" }));
    return;
  }

  if (req.user.role !== "manager" && req.user.role !== "admin") {
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "ไม่มีสิทธิ์เข้าถึง (สำหรับ Manager หรือ Admin เท่านั้น)" }));
    return;
  }

  if (typeof next === "function") {
    next();
  }
}

module.exports = { authMiddleware, adminMiddleware, managerMiddleware, signJwt, verifyJwt };