const mongoose=require("mongoose")

mongoose
  .connect("mongodb://127.0.0.1:27017/weatherApp")
  .then(() => {
    console.log("connect to mongoose");
  })
  .catch((err) => {
    console.log(err);
  });
