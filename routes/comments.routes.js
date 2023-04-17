const express = require("express");
const router = express.Router();

const Comment = require("../models/Comment.model");

const { isAuthenticated } = require("../middleware/jwt.middleware")

router.get("/comments/:id", isAuthenticated, (req, res, next) => {
    const {id} = req.params;
    const user = req.payload._id

    Comment.findById(id)
        .populate("likes")
        .then( response => {
            let userInLikes = false;
            response.likes.forEach( element => {
                element.id === user;
                userInLikes = true;
            })
            if(!userInLikes){
                return Comment.findByIdAndUpdate(id, {$push: {"likes": user }}, {safe: true, upsert: true, new : true})
            }else{
                return Comment.findByIdAndUpdate(id, {$pull: {"likes": user }}, {safe: true, upsert: true, new : true})
            }
        })
        .then( response => {
            res.status(201).json(response)
        })
        .catch(err => {
            console.log("error creating new like", err);
            res.status(500).json({
                message: "error creating new like",
                error: err
            });
        })
})

router.delete("/comments/:id", isAuthenticated, (req, res, next) => {
    const {id} = req.params;
    const user = req.payload._id

    Comment.findById(id)
        .populate("user")
        .then( response => {
            if(response.user.id === user){
                return Comment.findByIdAndDelete(id)
            }
        })
        .then(response => {
            res.status(200).json(response)
        })
        .catch(err => {
            console.log("error deleting comment", err);
            res.status(500).json({
                message: "error deleting comment",
                error: err
            });
        })
})
module.exports = router;