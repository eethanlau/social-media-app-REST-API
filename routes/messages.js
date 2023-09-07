const router = require("express").Router();
const Message = require("../models/Message");

//Create a message to be sent
router.post("/", async(req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
})

//Read a message that has been sent
//Send a get request with the conversationId that the message belongs to
router.get("/:conversationId", async(req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;