const express = require("express");
const cors = require("cors");
const chalk = require("chalk");
require("dotenv").config();
const app = express();
const apiRouter = require("./routes/router");
const { setBackEndUrl } = require("./utils/mongoose");
const { Backend } = require("./mongodb/schema");

const originAllowed = process.env.FRONTEND_ADDRESS.split(",");

app.use((req, res, next) => {
  const origin = req.headers.origin || "unknown origin";
  const referer =
    req.headers.referer || req.headers.referrer || "unknown referer";
  // const ip = req.ip;
  // const url = req.originalUrl;
  const refererSplit = referer.split("/");
  const domain = refererSplit[0] + "//" + refererSplit[2];

  console.log("domain:", domain);

  if (origin === "unknown origin" && referer.includes("replit")) {
    setBackEndUrl(domain);
  }

  // console.log(`Request details:
  //   origin: ${origin}
  //   referer: ${referer}
  //   ip: ${ip}
  //   url: ${url}
  // `);
  next();
});

app.use(express.json());
console.log("Allowed Origins: ", originAllowed);

app.use(
  cors({
    origin: originAllowed, // Izinkan kedua origin
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization",
    optionsSuccessStatus: 200,
  })
);

app.get("/", async (req, res) => {
  const url = await Backend.find();
  res.status(200).json({ url: url[0].url });
});

app.use("/api", apiRouter);

// eslint-disable-next-line no-unused-vars
app.use(function errorHandler(err, req, res, next) {
  console.log(chalk.bgRed("error handler"));
  console.error(chalk.bgRed(err.message)); // Log error untuk debugging
  // Mengirimkan respons dengan status dan pesan error
  res
    .status(err.status || 500)
    .json({ status: "fail", message: err.message || "Internal Server Error" });
});

module.exports = app;
