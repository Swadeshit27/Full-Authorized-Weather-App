require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const alluserdata = new mongoose.Schema({
  firstname: {
    type: String,
    require: true,
  },
  lastname: {
    type: String,
    require: true,
  },
  mobile: {
    type: Number,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: [true, "email already exist"],
  },
  gender: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  cpassword: {
    type: String,
    require: true,
  },
  tokens: [
    {
      token: {
        type: String,
        require: true,
      },
    },
  ],
});
// generate token
alluserdata.methods.generateToken = async function () {
  try {
    // console.log(this._id.toString());
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SEQURITY_KEY
    );
    this.tokens = this.tokens.concat({ token });
    // this.save();

    return token;
  } catch (error) {
    console.log(error);
  }
};

// password hash
alluserdata.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.cpassword = undefined;
  }
  next();
});

const RegiserData = new mongoose.model("RegiserData", alluserdata);
module.exports = RegiserData;
