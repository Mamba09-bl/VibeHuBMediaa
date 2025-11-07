const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // who sent it
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // who received it
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("chat", messageSchema);
