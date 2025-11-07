const mongoose  = require("mongoose")


const profileSchema = mongoose.Schema({
 postText:String,
 uploadTime: {
    type: Date,
    default: Date.now
  },user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"   // link post back to user
  },
  image:String,
  comment:String

})

module.exports = mongoose.model("profile",profileSchema)