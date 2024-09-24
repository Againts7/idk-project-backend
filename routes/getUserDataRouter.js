const express = require("express");
const { findUser } = require("../utils/mongoose");

const router = express.Router();

// eslint-disable-next-line no-unused-vars
router.get("/", async (req, res, next) => {
  const username = req.user.username;
  const userData = await findUser(username);
  if (userData) {
    const { name, data } = userData;
    return res.json({
      status: "success",
      data: { username: name, data },
    });
  }
  return res.json({
    status: "fail",
    message: "user not found",
  });
});

module.exports = router;
