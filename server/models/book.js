const  mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({

    url:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,

    },
    description:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    language:{
        type:String,
        required:true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1, 
    }
},
{timestamps:true}
);

module.exports = mongoose.model("book" , BookSchema);