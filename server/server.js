const express=require("express");
const app=express();
require("dotenv").config();
const {connectWithDatabase} = require("./config/database")

const port= process.env.PORT || 4000;
app.listen(port, ()=>{
    console.log("Server is listening at port",port);
} )

connectWithDatabase();