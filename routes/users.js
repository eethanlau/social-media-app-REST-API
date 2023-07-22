const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = require("express").Router();

//Update user
router.put("/:id", async(req, res) => {
  //If the userId is the same as the requested ID, allow for the change to occur
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    //If the user tries to update the password
    if (req.body.password) {
      try {
        //Generate  a new password
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
          return res.status(500).json(err)
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body, });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
    //If the user tries to update the username
  } else {
    return res.status(403).json("You can update only your account");
  }
});

//Delete a user
router.delete("/:id", async(req, res) => {
  //If the userId is the same as the requested ID, allow for the change to occur
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
    //If the user tries to update the username
  } else {
    return res.status(403).json("You can delete only your account");
  }
});

//Get a user
router.get("/:id", async(req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other} = user._doc
    res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
})

//Follow a user
//Await for the user to be able to push a follower
//Await for the the user that is following to push a user into its following field
//Async function
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    //When following an account append to that account the user is following and update its data for the followers' key and its value.
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      //Prevent a user for following again after already following them once
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId}});
        await currentUser.updateOne({ $push: { followings: req.params.id}});
        res.status(200).json("User has been followed.");
      }
      //Else, send a status code to the user stating that they already follow this individual
      else {
        res.status(403).json("You already follow this user.");
      }
    } catch (err) {
      res.status(500).json(err)
    }

  } else {
    res.status(403).json("Cannot follow your own account")
  }
});

//Unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params) {
    //When following an account append to that account the user is following and update its data for the followers' key and its value.
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      //If user includes this as a follower, then you cna unfollow such account accordingly
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId}});
        await currentUser.updaterOne({ $pull: { followings: req.params.id}});
        res.status(200).json("User has been unfollowed");
      }
      //Else, send a status code to the user stating that they already follow this individual
      else {
        res.status(403).json("You already do not follow this user.");
      }
    } catch (err) {
      res.status(500).json(err)
    }

  } else {
    res.status(403).json("Cannot unfollow your own account")
  }
});

module.exports = router;