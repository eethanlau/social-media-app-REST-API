const mongoose = require("mongoose");

//Schema for how the posts will be set up accordingly for the project
const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      max:500
    },
    img: {
      type: String
    },
    likes: {
      type: Array,
      default: []
    },
  },
  {timestamps:true}
);

module.exports = mongoose.model("Post", UserSchema);