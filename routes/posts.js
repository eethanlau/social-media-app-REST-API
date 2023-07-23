//CRUD for posts for users to perform
const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// CRUD Functionality:

//Create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch(err) {
    res.status(500).json(err);
  }
});

//Update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
        //Sets the values of the body field with the request's body's field that is sent through a put request
        await post.updateOne({$set: req.body});
        res.status(200).json("Successfully updated your post!")
    } else {
      res.status(403).json("You can update only your post")
    }
  } catch (err) {
    res.status(500).json(err);
  }
})

//Delete a post
router.delete("/:id", async (req, res) => {
  try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
        //Sets the values of the body field with the request's body's field that is sent through a put request
        await post.deleteOne();
        res.status(200).json("Successfully deleted your post!")
      } else {
        res.status(403).json("You can delete only your post")
      }
  } catch (err) {
    res.status(500).json(err);
  }
});

//Like a post / Dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //If the post is not already liked by the user, proceed to let the user like the post accordingly
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked")
    } else {
      //By pressing the like button again, you dislike a post you had liked
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }

});

//Get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get timeline posts
router.get("/timeline/all", async (req, res) => {
  //Find a collection of posts that are related to a user and its friends/followers
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id});
    //Match all friends posts
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    //Concatenates all the friends' posts as well
    res.json(userPosts.concat(...friendPosts));
  } catch (err) {
      res.status(500).json(err);
  }
});

//Get timeline posts

module.exports = router;