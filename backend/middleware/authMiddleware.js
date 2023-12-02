const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler =  require("express-async-handler")

const auth = asyncHandler(async(req, res, next)=>{
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1];
            console.log(token)
            console.log(process.env.JWT_SECRET);
            const ver = jwt.verify(token, process.env.JWT_SECRET);
            console.log("1")
            console.log(ver)
            req.user = await User.findById(ver.id).select("-password");
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if(!token){
        res.status(401);
        throw new Error("Not authorized, no token")
    }
})

module.exports = {auth}