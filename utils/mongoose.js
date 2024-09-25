const { Backend, User } = require("../mongodb/schema");

async function setBackEndUrl(url) {
  try {
    const backend = await Backend.findOne({ name: "replit" });

    if (!backend) {
      return "not found";
    }

    backend.url = url;

    console.log(backend);

    const updatedUrl = await backend.save();
    return updatedUrl.url;
  } catch (e) {
    console.log(e);
    return e.message;
  }
}

async function createUser(name, password) {
  try {
    await User.init();
    const newUser = new User({
      name,
      password,
    });
    await newUser.save();
    console.log("user created!");
    return {
      status: "success",
      message: "user created!",
    };
  } catch (e) {
    if (e.code === 11000) {
      return { status: "fail", message: "username is already taken!" };
    } else {
      return { status: "fail", message: e.message };
    }
  }
}

async function findUser(name) {
  try {
    const user = await User.findOne({ name });
    return user;
  } catch (e) {
    console.log("error find user:", e);
    return e.message;
  }
}

async function deleteUser(name) {
  try {
    const deleted = await User.deleteOne({ name });
    if (deleted.deletedCount === 0) {
      return "user not found!";
    } else {
      return "user deleted successfully!";
    }
  } catch (e) {
    console.log("error delete user:", e);
    return e.message;
  }
}

module.exports = { setBackEndUrl, createUser, findUser, deleteUser };
