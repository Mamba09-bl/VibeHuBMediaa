const express = require("express")
const router = express.Router()
const bcrypt =  require("bcrypt")
const cookieParser =  require("cookie-parser")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user-module")
const postModel = require("../models/post-module")
const upload = require("../config/multer-config")


const authMiddleware = require("../middlewares/auth")


router.post("/signup",upload.single('image'),async(req,res)=>{
 let {username,email,password} = req.body
     const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already registered");
      // or res.redirect("/signup?error=Email+already+registered");
    }
 
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async(err,hash)=>{
            const user = await userModel.create({
                username,
                email,
                password:hash,
                image:req.file.filename
            })
            let token = jwt.sign({email:email,id:user._id},"secret")
            res.cookie("token",token)
            console.log(user);
            res.redirect("/login")
        })
    })
    

})



router.post("/login",async(req,res)=>{
    let {email,password} = req.body

    let user = await userModel.findOne({email})
  if(!user) return res.status(401).send("Something went wrong")
    

    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            let token = jwt.sign({email:email,id:user._id},"secret")
            res.cookie("token",token)
          res.redirect("/profile")
        }else{
            res.send("wrong")
        }
    })
})

router.post(
  '/upload-post',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'story', maxCount: 1 }
  ]),
  authMiddleware,
  async (req, res) => {
    let { postText,like } = req.body;

    let image = req.files['image'] ? req.files['image'][0].filename : null;
    let story = req.files['story'] ? req.files['story'][0].filename : null;

    // create post
    if(!postText == ''){
      const post = await postModel.create({
        postText,
        user: req.user._id,
        image,
        story,
        like
      });
      await post.save();
      const user = await userModel.findById(req.user._id);
      user.post.push(post._id);
      await user.save();
    }


    // update user

   

    res.redirect("/profile");
  }
);








router.post("/create-post/:id", authMiddleware, async (req, res) => {
  const postId = req.params.id;
  const newText = req.body.postText;

  // Update post in DB
  await postModel.findByIdAndUpdate(postId, { postText: newText });

  res.redirect("/profile"); // go back to profile after editing
});










module.exports = router