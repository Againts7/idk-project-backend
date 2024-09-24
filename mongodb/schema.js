const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const backendSchema = new Schema({
  name: String,
  url: String,
});

const Backend = mongoose.model("backend", backendSchema);

const userDataSchema = new Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  data: {
    role: { type: String, default: "member" },
    profilePic: { type: String, default: "https://picsum.photos/200" },
    backgroundPic: { type: String, default: "https://picsum.photos/300/150" },
    credit: { type: Number, default: 5 },
  },
});

userDataSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});

const User = mongoose.model("User", userDataSchema);

module.exports = { User, Backend };
