const express = require('express');
require('dotenv').config();
const app=express()
const cors= require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieParser = require("cookie-parser");
const connect=require("./Config/db");
const authRoute=require("./Routes/authRoute");
const userRoutes = require("./Routes/userRoute"); 
const companyRoutes = require("./Routes/companyRoute")
const jobRoutes = require("./Routes/jobRoute");
connect();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use('/auth',authRoute);
app.use('/user',userRoutes);
app.use('/company',companyRoutes);
app.use('/job',jobRoutes);
const PORT = process.env.PORT||3000;

app.listen(PORT,()=>{
    console.log(`server running on http://localhost:${PORT}`);
})
