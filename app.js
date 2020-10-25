const express = require('express');
const app = express();
const env = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieparser = require('cookie-parser')
// import routes
const authroutes = require('./routes/auth.js');
const dashboard = require('./routes/dashboard.js');
//config .env files
env.config();

// DB config
mongoose.connect(process.env.DB_CONNECT ,{ useUnifiedTopology: true , useNewUrlParser: true}, (err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log('connected to db');
    }
})

//config cookie-parser
app.use(cookieparser())
//config cors
app.use(cors({origin:"http://localhost:3000", credentials:true}));

//middleware
app.use(express.json());
// app.use(function(req, res, next) {
//     var allowedOrigin = "http://localhost:3000"
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Origin', allowedOrigin);
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'X-Token, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
//     res.header('Access-Control-Expose-Headers','*');
//     next();
//   });


// Route middleware
app.use('/api/user/',authroutes);
app.use('/api/user/',dashboard);

// Listening to port 
app.listen(process.env.PORT , () => {
    console.log(`listening on port ${process.env.PORT}`);
})
