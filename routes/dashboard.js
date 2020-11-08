const router = require('express').Router();
const verify = require('./verification.js');
const User = require('../models/User.js'); 
const jwt = require('jsonwebtoken');
const fs = require('fs');

router.get('/dashboard',verify,(req,res)=>{
    const token = req.header('Cookie').split(';')[0].split('=')[1];
    const username = jwt.decode(token).username;
    const response = new Object();
    response.message = "Verified";
    response.code = 0;
    response.name = username;
    res.status(200);
    res.send(response);
    
})

router.get('/currentPlayingFetch',verify,async (req,res)=>{
    const token = req.header('Cookie').split(';')[0].split('=')[1];
    const username = jwt.decode(token).username;
    const user = await User.findOne({name : username});
    const response = new Object();
    response.url = user.img;
    response.name = user.img_name;
    response.artist = user.img_artist;
    response.songUri = user.songUri;
    response.songId = user.songId;
    res.status(200);
    res.send(response);
})

router.post('/currentPlaying',verify , async (req,res)=>{
    const token = req.header('Cookie').split(';')[0].split('=')[1];
    const username = jwt.decode(token).username;
    const user = await User.findOne({name : username}); 
    try{
        user.img = req.body.image;
        user.img_name = req.body.title;
        user.img_artist = req.body.artist;
        user.songUri = req.body.songUri;
        user.songId = req.body.artistId;
        await user.save();
        const response = new Object();
        response.message = 'Song Saved Successfully';
        response.code = '1';
        res.status(200);
        res.send(response);
    }catch(err){
        const response = new Object();
        response.message = "Database Exception";
        response.code = "0";
        res.status(500);
        res.send(response);
    }
})

module.exports = router;