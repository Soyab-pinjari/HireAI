const { default: mongoose } = require("mongoose");


const CompanySchema = new mongoose.Schema({
companyName:{
    type:String,
    required:true,
    trim:true,
},
companyEmail:{
    type:String,
    required:true,
    trim:true,
    lowercase:true,

},
phone:{
    type:String,
    trim:true,
    minlenght:10,
},
profileImage:{
type:String,
default:""
},
jobs:{
    type:[
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  }
],
    ref:'job',
    default:null
},
industry:{
    type:String,
    required:true,

},
description:{
    type:String,
    default:"",
    trim:true
},
country:{
    type:String,
    default:"",
},
address:{
    type:String,
    default:"",
    trim:true
    
}
},{timestamps:true})

module.exports = mongoose.model("Company", CompanySchema);