const express = require("express");
const router = express.Router();

const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware")


router.get("/users", isAuthenticated, (req, res, next) => {
    
    User.find()
        .then( usersFromDB => {
            res.status(201).json(usersFromDB)
        })
        .catch( err => console.log("error getting users from DB", err))
})

router.get("/users/follow/:id", isAuthenticated, (req,res, next) => {
    const followId = req.params.id
    const _id = req.payload._id;

    User.findById(_id)
        .populate("followers")
        .then( response => {
            
            let userInFollowers = false;
            response.followers.forEach( element => {
                if(element._id === followId){
                    userInLikes = true;
                }
            })
            if(!userInFollowers){
                return User.findByIdAndUpdate(_id, {$push: {"followers": { _id:followId }}}, {safe: true, upsert: true, new : true})
            }
        })
        .then( response => {
            res.status(201).json(response)
        })
        .catch( err => console.log("error finding user by id", err))
})

router.get("/users/:id", isAuthenticated, (req, res, next) => {
    const {id} = req.params

    User.findById(id)
        .populate("posts")
        .populate("travelguides")
        .populate("followers")
        .then( user => {
            res.status(201).json(user)
        })
        .catch( err => console.log("error finding user by id", err))
})

router.put("/users/:id", isAuthenticated, (req, res, next) => {
    const { id } = req.params;
    const { email, name, profileImg, location, } = req.body

    User.findByIdAndUpdate(id, {email, name, profileImg, location }, { new: true})
        .then(updatedUser => {
            res.status(200).json(updatedUser)
        })
        .catch( err => console.log("error updating user", err))

})

router.delete("/users/:id", isAuthenticated, (req, res, next) => {
    const {id} = req.params

    User.findByIdAndDelete(id)
        .then( response => {
            res.status(201).json(response)
        })
        .catch( err => console.log("error deleting user", err))
})


module.exports = router;