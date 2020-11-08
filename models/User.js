const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        min : 6,
        max : 255
    },
    email : {
        type : String , 
        required : true,
        min : 6,
        max : 255,
    },
    password : {
        type : String , 
        required : true,
        min :6,
        max : 1024
    },
    img : {
        type : String,
    },
    img_name : {
        type : String,
    },
    img_artist : {
        type : String
    },
    songUri : {
        type : String
    },
    songId : {
        type : String
    }
});

module.exports = mongoose.model('User',user);