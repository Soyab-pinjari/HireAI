const { default: mongoose } = require("mongoose")

const UserSchema = new mongoose.Schema({
name:{
    type:String,
    required:true,
    trim:true,
},
email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
},
password:{
    type:String,
    required:true,
    minlenght:6,
},
profileImage:{
    type:String,
    default:""
},
location:{
    type:String,
    default:""
},
phone:{
type:String,
minlenght:10,
},

bio:{
type:String,
maxlenght:500,
default:"",
},
role:{
      type: String,
      enum: ["jobseeker","recruiter" ,"admin"],
         default: "jobseeker",
      required: true
    }, 
skills:{
    type:[String],
    default:[],
},    
 experience: {
      type: Number,
      min: 0,
      default: 0
    },
  education: {
      type: String,
      default: ""
    },
     resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null
    },

} ,{
    timestamps: true, // Automatically creates createdAt and updatedAt
  })

  UserSchema.index({role:1});
  UserSchema.index({skills:1});

module.exports = mongoose.model('User',UserSchema);













