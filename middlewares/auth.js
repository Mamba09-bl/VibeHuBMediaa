const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-module");

const authMiddleware  = async(req,res,next)=>{
    const token = req.cookies?.token;
    if(!token) return res.status(401).send("Not logged in");
       
    const decoded = jwt.verify(token,"secret");

    // fetch user by ID from decoded token
    req.user = await userModel.findOne({ email: decoded.email});

    if (!req.user) return res.status(404).send("User not found");

    next();
}


module.exports = authMiddleware;
