const mongoose=require("mongoose");
require("dotenv").config();

const connectWithDatabase = () =>{
    mongoose.connect(process.env.DATABASE_URL)
    .then( () => console.log("Database connected Successfully..!!!") )
    .catch( (error) => {
        console.log("Database Connection failed..!!!");
        console.log(error);
        process.exit(1);
    } )
}

module.exports = {connectWithDatabase}