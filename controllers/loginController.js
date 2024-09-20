const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const users = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
  },
];

async function loginController(req, res, next) {
  const { username, password } = req.body;

  try {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET_KEY,
        { expiresIn: "1d" } // Token berlaku selama 1 hari
      );

      // Kirim token ke client dan hentikan eksekusi
      return res.json({ token });
    } else {
      // Jika user tidak ditemukan, lanjutkan ke middleware error handler
      throw new Error("username atau password salah");
    }
  } catch (err) {
    err.status = 401;
    next(err);
  }
}

module.exports = loginController;
