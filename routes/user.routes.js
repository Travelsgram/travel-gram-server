const express = require("express");
const router = express.Router();

const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Travelguide = require("../models/Travelguide.model");
const Comment = require("../models/Comment.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");


router.get("/users", isAuthenticated, (req, res, next) => {
    //const value = req.query.user
    //{ name : { $eq: value } }

    User.find()
        .then( usersFromDB => {
            res.status(201).json(usersFromDB)
        })
        .catch( err => {
            console.log("error getting users from DB", err);
            res.status(500).json({
                message: "error getting users from DB",
                error: err
            });
        })
})

router.get("/users/follow/:id", isAuthenticated, (req,res, next) => {
    const followId = req.params.id
    const _id = req.payload._id;

    User.findById(_id)
    .populate("followers")
    .then( response => {
            let userInFollowers = false;
            
            response.followers.forEach( element => {
                if(element.id === followId){
                    userInFollowers = true;
                }
            })
            if(!userInFollowers){
                return User.findByIdAndUpdate(_id, {$push: {"followers": { _id:followId }}}, {safe: true, upsert: true, new : true})
            }else if(userInFollowers){
                return User.findByIdAndUpdate(_id, {$pull: {"followers": followId }}, {safe: true, upsert: true, new : true})
            }
        })
        .then(response => {
            res.status(201).json(response)
        })
        .catch( err => {
            console.log("error storing follow reference", err);
            res.status(500).json({
                message: "error storing follow reference",
                error: err
            });
        })
})

router.get("/users/:id", isAuthenticated, (req, res, next) => {
    const {id} = req.params

    User.findById(id)
        .populate({
            path: "posts",
            populate: {
                path: "comments",
                populate: {
                    path: "user"
                }
            }
        })
        .populate("travelguides")
        .populate("followers")
        .then( user => {
            res.status(201).json(user)
        })
        .catch( err => {
            console.log("error getting user from DB", err);
            res.status(500).json({
                message: "error getting user from DB",
                error: err
            });
        })
})

router.put("/users/:id", isAuthenticated, (req, res, next) => {
    const { id } = req.params;
    const { email, name, profileImg, location, } = req.body

    User.findByIdAndUpdate(id, {email, name, profileImg, location }, { new: true})
        .then(updatedUser => {
            res.status(200).json(updatedUser)
        })
        .catch( err => {
            console.log("error updating user in DB", err);
            res.status(500).json({
                message: "error updating user in DB",
                error: err
            });
        })

})

router.delete("/users/:id", isAuthenticated, (req, res, next) => {
    const {id} = req.params

    Post.deleteMany({"user":id})
        .then( response => {
            return Travelguide.deleteMany({"user":id})
        })
        .then( response => {
            return Comment.deleteMany({"user":id})
        })
        .then( response => {
            return User.findByIdAndDelete(id)
        })
        .then( response => {
            res.status(201).json(response)
        })
        .catch( err => {
            console.log("error deleting user from DB", err);
            res.status(500).json({
                message: "error deleting user from DB",
                error: err
            });
        })
})


module.exports = router;