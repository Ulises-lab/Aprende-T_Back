const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/Student.model");
const Session = require("../models/Session.model");

router.get('/UserProfile', (req,res) =>{
    User.findOne({ email })
    .then((user) =>{
        console.log(user)
    })
})