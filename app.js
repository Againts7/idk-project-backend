const express = require("express");
const cors = require("cors");
const chalk = require("chalk");
require("dotenv").config();
const app = express();

const originAllowed = process.env.FRONTEND_ADDRESS.split(",");
console.log(originAllowed);

app.use((req,res,next)=>{
  const origin = req.headers.origin||'unknown origin';
  const referer = req.headers.referer || req.headers.referrer || 'unknown referer';
  const ip = req.ip;
  const url = req,originalUrl;

  console.log(`Request details:
    origin: ${origin},
    referer: ${referer};
    ip: ${ip},
    url: ${url}
  `)
  next();
})

app.use(express.json());
app.use(
  cors({
    origin: originAllowed, // Izinkan kedua origin
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization",
  })
);

const apiRouter = require("./routes/router");

app.use("/api", apiRouter);

// eslint-disable-next-line no-unused-vars
app.use(function errorHandler(err, req, res, next) {
  console.log(chalk.bgRed("error handler"));
  console.error(chalk.bgRed(err.message)); // Log error untuk debugging
  // Mengirimkan respons dengan status dan pesan error
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
