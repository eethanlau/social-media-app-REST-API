const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");

// Establish all routes to be utilized
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const cors = require("cors");

//Use cors in order to allow for the images to be uploaded properly
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use(
  express.urlencoded({ extended: true })
);

dotenv.config();

//Mongoose connection

mongoose.connect(process.env.MONGO_URL, {});
app.use("/images", express.static(path.join(__dirname, "public/images")));

//Middleware for project
//Might need to remove this but not sure just yet
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
});


const upload = multer({storage});
// Upload a post
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File upload successful.");
  } catch(err) {
    console.log(err);
  }
})

//Update profile picture by clicking on your profile
app.post("/api/:id/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("Profile picture upload successful.");
  } catch(err) {
    console.log(err);
  }
})

app.get("/", (req,res) => {
  res.send("welcome to the homepage")
})

app.get("/users", (req,res) => {
  res.send("welcome to the user page")
})

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});
