const bcrypt=require("bcrypt")
const User = require("../Modal/User");
const jwt = require("jsonwebtoken")

const register=async(req,res)=>{
    try {
      
        const {name,email,password,role}=req.body;
           
        if(!name || !email || !password ||!role){
            return res.status(400).json({success:false,message:"all fields are required"})
        }
        if (!["jobseeker", "recruiter"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }
        if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }
      const existUser = await  User.findOne({email:email.toLowerCase().trim()});
        if(existUser){
            return res.status(409).json({success:false,message:"User already Exist"});

        }
   

const hashedPassword = await bcrypt.hash(password, 10);

const user = await User.create({
    name,
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role
});

return res.status(201).json({
    success: true,
    message: "Registration successful",
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
});
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}


const login =async(req,res)=>{
try {
    const {email,password}=req.body;
    if(!email||!password){
        res.status(400).json({success:false,message:"Email and Password are required"});
    }

    const user = await User.findOne({email:email.toLowerCase().trim()});
    if(!user){
         return res.status(401).json({
        success: false,
        message: "Invalid email "
      });
    }
    console.log("2. User found:", !!user);

      const isMatch = await bcrypt.compare(
      password,
      user.password
    );
     if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }


    const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:"24h"}) 
    res.cookie("token",token,{
      httpOnly:true,
      secure:process.env.NODE_ENV==="production", 
      sameSite:"lax",
      maxAge:24*60*60*1000
    });

     return res.status(200).json({
      success: true,
      message: "Login successful",
   
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  
} catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
}
    
}

      

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



module.exports={register,login,logout};