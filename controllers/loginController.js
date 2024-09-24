const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { findUser } = require("../utils/mongoose");
const chalk = require("chalk");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

async function loginController(req, res, next) {
  const { username, password } = req.body;

  try {
    const user = await findUser(username); // Cari user berdasarkan username
    console.log(user);

    if (!user) {
      // Jika user tidak ditemukan, lemparkan error dengan pesan yang jelas
      const error = new Error("Username tidak ditemukan!");
      error.status = 404;
      throw error;
    }

    // Menggunakan await untuk bcrypt.compare agar tetap dalam alur async/await
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("isMatch", isMatch);

    if (!isMatch) {
      const error = new Error("Password salah!");
      error.status = 401;
      throw error;
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user._id, username: user.name },
      JWT_SECRET_KEY,
      { expiresIn: "1d" } // Token berlaku selama 1 hari
    );

    // Kirim token ke client
    return res.json({ token });
  } catch (err) {
    // Logging untuk debugging
    console.log(chalk.bgRed("Login error:", err.message));

    // Set status untuk error yang dilempar dan teruskan ke error handler
    err.status = err.status || 500;
    next(err);
  }
}

module.exports = loginController;
