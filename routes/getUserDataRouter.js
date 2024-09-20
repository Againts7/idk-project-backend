const express = require("express");

const router = express.Router();

const users = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    role: "superuser",
  },
];

// eslint-disable-next-line no-unused-vars
router.get("/", (req, res, next) => {
  const username = req.user.username;
  const data = users.find((u) => u.username === username);
  if (data) {
    // eslint-disable-next-line no-unused-vars
    const { password, ...rest } = data;
    return res.json({
      status: "success",
      data: rest,
    });
  }
  return res.json({
    status: "fail",
    message: "user not found",
  });
});

module.exports = router;
