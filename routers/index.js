const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const postModel = require("../models/post-module");
const userModule = require("../models/user-module");
const { all } = require("axios");
const chat = require("../models/chat-module");
const message = require("../models/chat-module");
const axios = require("axios");

router.get("/", (req, res) => {
  res.render("signUp");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/profile", authMiddleware, async (req, res) => {
  const currentUser = await userModule
    .findById(req.user._id)
    .populate("following");
  const otherUser = await userModule.findById(req.user._id).populate({
    path: "following",
    populate: { path: "post" }, // this will replace post ObjectIds with actual post docs
  });
  const showpost = await userModule.findById(req.user._id).populate("post");
  console.log(showpost);

  const allEmail = await userModule.find();

  // Get current user's posts
  let posts = await postModel.find({ user: currentUser._id });

  // Get posts of people current user follows

  for (let followedUser of currentUser.following) {
    const followedPosts = await postModel.find({ user: followedUser._id });
    // console.log(followedPosts)
    posts = posts.concat(followedPosts);
    //  console.log(posts)
  }
  // console.log(currentUser);

  const emailsWithId = allEmail.map((user) => ({
    _id: user._id,
    email: user.email,
  }));

  const ss = await userModule.find({ email: req.user.email });
  // emailsWithId.splice(ss.length, 1);

  const filterEmail = emailsWithId.filter(
    (user) => user.email !== currentUser.email
  );
  // console.log(filterEmail);

  // console.log(emailsWithId);

  res.render("profile", {
    posts,
    user: showpost,
    emailsWithId: filterEmail,
    following: otherUser.following,
    following: currentUser.following.length,
    followers: currentUser.followers.length,
    posts: currentUser.post.length,
  });
});

router.get("/home", authMiddleware, async (req, res) => {
  const currentUser = await userModule
    .findById(req.user._id)
    .populate("following");
  const otherUser = await userModule.findById(req.user._id).populate({
    path: "following",
    populate: { path: "post" }, // this will replace post ObjectIds with actual post docs
  });
  const showpost = await userModule.findById(req.user._id).populate("post");

  // Get current user's posts
  let posts = await postModel.find({ user: currentUser._id });

  // Get posts of people current user follows
  for (let followedUser of currentUser.following) {
    const followedPosts = await postModel.find({ user: followedUser._id });
    posts = posts.concat(followedPosts);
  }
  console.log(posts);

  // console.log(showpost);
  res.render("home", {
    posts,
    following: otherUser.following,
    user: showpost.post,
    showpost,
  });
});

router.post("/follow/:id", authMiddleware, async (req, res) => {
  const userToFollow = await userModule.findById(req.params.id);
  const currentuser = await userModule.findById(req.user._id);

  if (!currentuser.following.includes(userToFollow._id)) {
    currentuser.following.push(userToFollow._id);
    userToFollow.followers.push(currentuser._id);
  }
  console.log(userToFollow);

  await currentuser.save();
  await userToFollow.save();
  res.redirect("/profile");
});

router.get("/followers", authMiddleware, async (req, res) => {
  const currentUser = await userModule
    .findById(req.user._id)
    .populate("followers");
  console.log(currentUser.followers);

  res.render("followers", {
    followers: currentUser.followers,
    following: currentUser.following,
  });
});

router.get("/follwoing", authMiddleware, async (req, res) => {
  const currentUser = await userModule
    .findById(req.user._id)
    .populate("following");
  // console.log(currentUser);

  res.render("following", {
    followers: currentUser.followers,
    following: currentUser.following,
  });
});

router.get("/delete/:id", authMiddleware, async (req, res) => {
  const showpost = await userModule.findById(req.user._id).populate("post");
  const post = showpost.post;
  let postfromurl = req.params.id;
  const index = post.findIndex((p) => p.id === postfromurl);
  const sp = post.splice(index, 1);
  await showpost.save();
  console.log(sp);
  res.redirect("/profile");
});

router.get("/edit/:id", authMiddleware, async (req, res) => {
  const showpost = await userModule.findById(req.user._id).populate("post");
  const id = req.params.id;

  let p = [];
  showpost.post.filter((i) => {
    if (i._id == id) {
      p.push(i);
    }
  });

  //  console.log(p);

  res.render("edit", { p });
});

router.get("/chat", authMiddleware, async (req, res) => {
  const currentUser = await userModule
    .findById(req.user._id)
    .populate("following");
  const allEmail = await userModule.find();
  const emailsWithId = allEmail.map((user) => ({
    _id: user._id,
    email: user.email,
  }));
  const ss = await userModule.find({ email: req.user.email });
  const e = emailsWithId.splice(currentUser.email, 1);

  console.log(currentUser.following);

  res.render("chat", { showChat: currentUser.following });
});

router.post("/chat/:id", authMiddleware, async (req, res) => {
  const receiverId = req.params.id;
  res.redirect(`/chat/${receiverId}`); // go to chat with this user
});

// router.get("/chatWindow/:id", authMiddleware, async (req, res) => {
//   const receiverId = req.params.id;

//   const messages = await message
//     .find({
//       $or: [
//         { sender: req.user._id, receiver: receiverId },
//         { sender: receiverId, receiver: req.user._id },
//       ],
//     })
//     .populate("sender receiver");

//   res.render("chatWindow", { messages, receiverId });
// });

router.get("/unfollow/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  const redirectPage = req.query.redirect;
  const user = await userModule.findOne({ email: req.user.email });
  user.following = user.following.filter((i) => i.toString() !== id);
  await user.save();
  // user.following.findByIdAndDelete(id);

  console.log(user);

  if (redirectPage === "profile") {
    return res.redirect("/profile");
  } else {
    return res.redirect("/follwoing");
  }
});

module.exports = router;
