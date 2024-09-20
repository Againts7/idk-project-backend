const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
  // Ambil token dari header 'Authorization'
  const authHeader = req.headers["authorization"];

  // Token biasanya ada dalam format 'Bearer [token]'
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token diperlukan" });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded; // Simpan data pengguna yang ada dalam token ke objek request
    next(); // Lanjutkan ke handler rute berikutnya
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ status: "fail", err_name: err.name, message: err.message });
  }
};

module.exports = verifyToken;
