const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")
//Register route for authentication
router.get("/", (req, res) => {
  res.send("hey its auth route");
})

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    //Hash and salt the password accordingly with bcrypt
    const user = await newUser.save();
    res.status(200).json(user);
  } catch(err) {
    console.log(err);
  }
})
module.exports = router;