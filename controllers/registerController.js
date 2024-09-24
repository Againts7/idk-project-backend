const chalk = require("chalk");
const { createUser } = require("../utils/mongoose");

async function registerController(req, res, next) {
  console.log(req.body);
  const { username, password } = req.body;
  if (!username || !password) {
    const error = new Error("username or password required");
    next(error);
    return;
  }

  try {
    const { status, message } = await createUser(username, password);
    if (status === "success") {
      return res.status(201).json({ status, message });
    } else {
      console.log(chalk.bgRed("error di registerController:"), {
        status,
        message,
      });
      next(new Error(message));
    }
  } catch (e) {
    console.log(chalk.bgRed("Error creating account:").e);
    next(e.message);
  }
}

module.exports = registerController;
