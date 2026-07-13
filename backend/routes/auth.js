const { readJsonFile, writeJsonFile } = require("../utils/fileHandler");
const { signJwt } = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");

// Helper to check if string is a bcrypt hash
function isBcryptHash(password) {
  return typeof password === "string" && /^\$2[ayb]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/.test(password);
}

// Migrate any plain text passwords in users.json to bcrypt hashes
function migrateUsers() {
  const users = readJsonFile("users.json");
  let modified = false;

  const migratedUsers = users.map((user) => {
    if (!isBcryptHash(user.password)) {
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(user.password, salt);
      modified = true;
    }
    return user;
  });

  if (modified) {
    writeJsonFile("users.json", migratedUsers);
    console.log("Successfully migrated plain text passwords to bcrypt hashes.");
  }
}

// Run migration on load
migrateUsers();

// Utility to parse request JSON body in native Node.js
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function registerUser(req, res) {
  try {
    const { name, email, password } = await parseBody(req);

    if (!name || !email || !password) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" }));
      return;
    }

    const users = readJsonFile("users.json");

    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "อีเมลนี้ถูกใช้งานแล้ว" }));
      return;
    }

    // Determine the next ID sequentially
    let nextId = 1;
    if (users.length > 0) {
      const ids = users
        .map((u) => parseInt(u.id))
        .filter((id) => !isNaN(id));
      if (ids.length > 0) {
        nextId = Math.max(...ids) + 1;
      } else {
        nextId = users.length + 1;
      }
    }

    // Hash password with bcrypt before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object with empty profile fields
    const newUser = {
      id: nextId.toString(),
      name,
      email,
      password: hashedPassword,
      phone: "-",
      birthDate: "-",
      lineId: "-",
      facebook: "-",
      role: "user",
    };

    users.push(newUser);
    writeJsonFile("users.json", users);

    // Generate JWT token for the newly registered user
    const token = signJwt({ id: newUser.id, email: newUser.email, role: newUser.role });

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          birthDate: newUser.birthDate,
          lineId: newUser.lineId,
          facebook: newUser.facebook,
          role: newUser.role,
        },
      })
    );
  } catch (error) {
    console.error("Register error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }));
  }
}

// Handler for user login
async function loginUser(req, res) {
  try {
    const { email, password } = await parseBody(req);

    if (!email || !password) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "กรุณากรอกอีเมลและรหัสผ่าน" }));
      return;
    }

    let users = readJsonFile("users.json");

    // If users.json is empty, initialize with default user
    if (users.length === 0) {
      const hashedPassword = bcrypt.hashSync("password123", 10);
      const defaultUser = {
        id: "1",
        name: "Theepakorn Ruensukhonte",
        email: "theefordev@gmail.com",
        password: hashedPassword,
        phone: "-",
        birthDate: "-",
        lineId: "-",
        facebook: "-",
      };
      users = [defaultUser];
      writeJsonFile("users.json", users);
    }

    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    let isPasswordCorrect = false;
    if (matchedUser) {
      isPasswordCorrect = await bcrypt.compare(password, matchedUser.password);
    }

    if (!matchedUser || !isPasswordCorrect) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }));
      return;
    }

    // Generate JWT token for the user
    const token = signJwt({ id: matchedUser.id, email: matchedUser.email, role: matchedUser.role || "user" });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        token,
        user: {
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          phone: matchedUser.phone || "-",
          birthDate: matchedUser.birthDate || "-",
          lineId: matchedUser.lineId || "-",
          facebook: matchedUser.facebook || "-",
          role: matchedUser.role || "user",
        },
      })
    );
  } catch (error) {
    console.error("Login error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }));
  }
}

// Handler for user profile update
async function updateProfile(req, res) {
  try {
    const { id, name, email, phone, birthDate, lineId, facebook } = await parseBody(req);

    if (!id) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "ไม่พบข้อมูลผู้ใช้นี้" }));
      return;
    }

    // Verify token payload matches the request ID to protect other users' profile updates
    if (req.user && req.user.id !== id) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "ไม่มีสิทธิ์แก้ไขข้อมูลของบัญชีอื่น" }));
      return;
    }

    const users = readJsonFile("users.json");
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "ไม่พบผู้ใช้ในระบบ" }));
      return;
    }

    // Check if updated email is already taken by another user
    if (
      email &&
      users.some(
        (u) => u.id !== id && u.email.toLowerCase() === email.toLowerCase()
      )
    ) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "อีเมลนี้ถูกใช้งานโดยผู้ใช้อื่นแล้ว" }));
      return;
    }

    // Update user profile fields
    const updatedUser = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      email: email || users[userIndex].email,
      phone: phone !== undefined ? phone : users[userIndex].phone,
      birthDate: birthDate !== undefined ? birthDate : users[userIndex].birthDate,
      lineId: lineId !== undefined ? lineId : users[userIndex].lineId,
      facebook: facebook !== undefined ? facebook : users[userIndex].facebook,
    };

    users[userIndex] = updatedUser;
    writeJsonFile("users.json", users);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          birthDate: updatedUser.birthDate,
          lineId: updatedUser.lineId,
          facebook: updatedUser.facebook,
          role: updatedUser.role || "user",
        },
      })
    );
  } catch (error) {
    console.error("Update profile error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }));
  }
}

module.exports = { registerUser, loginUser, updateProfile };