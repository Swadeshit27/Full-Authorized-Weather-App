require("dotenv").config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 3000;

require("./db/conn");
const RegiserData = require("./model/collection");
const authorization = require("./middleware/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const static_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", views_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render("login");
});
app.get("/home", authorization, (req, res) => {
  res.render("index");
});
app.use(express.static(static_path));
app.get("/about", authorization, (req, res) => {
  res.render("about");
});
app.get("/weather", authorization, (req, res) => {
  res.render("weather");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/weather", (req, res) => {
  res.render("weather");
});

// create data
app.post("/signup", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    if (password === cpassword) {
      const registeremply = new RegiserData({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        mobile: req.body.mobile,
        email: req.body.email,
        gender: req.body.gender,
        password: password,
        cpassword: cpassword,
      });
      const gentoken = await registeremply.generateToken();
      // console.log(gentoken);
      res.cookie("jwt", gentoken, {
        expires: new Date(Date.now() + 5000000),
        httpOnly: true,
      });

      const finaldata = await registeremply.save();
      // console.log(finaldata);
      res.status(201).render("index");
    } else {
      res.send("password not match");
    }
  } catch (error) {
    console.log(`error occure ${error}`);
    res.status(400).send(error);
  }
});
app.post("/", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const useremail = await RegiserData.findOne({ email: email });
    const ismatch = await bcrypt.compare(password, useremail.password);
    const gentoken = await useremail.generateToken();
    res.cookie("jwt", gentoken, {
      expires: new Date(Date.now() + 5000000),
      httpOnly: true,
    });
    if (ismatch) {
      // console.log(`email ${email} and password ${password}`);
      await useremail.save();

      res.status(201).render("index");
    } else {
      res.send("invalid details");
    }
  } catch (error) {
    res.status(400).send("invalid details");
  }
});

// log out
app.get("/logout", authorization, async (req, res) => {
  try {
    // console.log(req.user);

    //  log out sigle device
    req.user.tokens = req.user.tokens.filter((currToken) => {
      // console.log(currToken.token);
      // console.log(req.user);
      return currToken.token !== req.token;
    });

    // log out from multiple devices
    // req.user.tokens = [];

    res.clearCookie("jwt");
    await req.user.save();
    res.render("login");
    // console.log("logout successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("*", (req, res) => {
  res.render("404", {
    errmsg: "oops page not found",
  });
});

app.listen(port, () => console.log("local host connected"));
