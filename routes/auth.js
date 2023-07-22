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
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //Save user
    //Hash and salt the password accordingly with bcrypt
    const user = await newUser.save();
    res.status(200).json(user);
  } catch(err) {
    res.status(500).json(err);
  }
});

//Login route
router.post("/login", async(req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("Incorrect password");
    
    //Send status code of 200 back if the login
    res.status(200).json(user);
    console.log(err);
  } catch(err) {
    res.status(500).json(err);
  }
})

module.exports = router;