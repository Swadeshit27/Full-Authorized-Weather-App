require("dotenv").config();
const jwbt = require("jsonwebtoken");

const RegiserData = require("../model/collection");

const authorization = async (req, res, next) => {
  const uniquetoken = req.cookies.jwt;
  if (!uniquetoken) {
    return res.sendStatus(403);
  }
  try {
    const verifyToken = jwbt.verify(uniquetoken, process.env.SEQURITY_KEY);
    // console.log(verifyToken);
    const user = await RegiserData.findOne({ _id: verifyToken._id });
    // console.log(user.firstname);
    req.token = uniquetoken;
    req.user = user;
    return next();
  } catch {
    return res.sendStatus(403);
  }
};

module.exports = authorization;
