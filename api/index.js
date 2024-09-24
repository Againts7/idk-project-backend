require("dotenv").config();
const mongoose = require("mongoose");
const app = require("../app");
const chalk = require("chalk");

const db = process.env.MONGODB;
const PORT = process.env.PORT || 3030;

mongoose
  .connect(db, { autoIndex: true })
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((e) => {
    console.log(chalk.bgRed("error connecting to mongodb:\n"), e);
  });

app.listen(PORT, () => {
  console.log(`server berjalan di: http://localhost:${PORT}`);
});
