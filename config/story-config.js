const multer = require("multer")
const path = require("path")
const crypto = require("crypto")



const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/images/uploads'),
   filename: function (req, file, cb) {
    crypto.randomBytes(12,(err,buffer)=>{
        const fn = buffer.toString("hex")+path.extname(file.originalname)
        cb(null,fn)
    })
  }
});
const story = multer({ storage });
module.exports  = story