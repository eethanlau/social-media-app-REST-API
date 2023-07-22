const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");

app.use(
  express.urlencoded({ extended: true })
);

dotenv.config();

//Mongoose connection

mongoose.connect(process.env.MONGO_URL, {});

app.get("/", (req,res) => {
  res.send("welcome to the homepage")
})

app.get("/users", (req,res) => {
  res.send("welcome to the user page")
})

//Middleware for project
//Might need to remove this but not sure just yet
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.listen(3000, () => {
  console.log("Backend server is running!");
});