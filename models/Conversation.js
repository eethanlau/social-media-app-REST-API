const mongoose = require("mongoose");

//Schema for how the posts will be set up accordingly for the project
const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    }
  },
  {timestamps:true}
);

module.exports = mongoose.model("Conversation", ConversationSchema);