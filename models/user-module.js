const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://hamzaahmed:hamza123@cluster0.k8hovee.mongodb.net/VibeHubMedia?retryWrites=true&w=majority"
);

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  image: String,
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profile",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ], // users who follow this user
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ], // users th
  chat: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
