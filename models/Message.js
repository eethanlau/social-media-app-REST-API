const mongoose = require("mongoose");

//Schema for how the posts will be set up accordingly for the project
const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String
    },
    sender: {
      type: String
    },
    text: {
      type: String
    },
    
  },
  {timestamps:true}
);

module.exports = mongoose.model("Message", MessageSchema);