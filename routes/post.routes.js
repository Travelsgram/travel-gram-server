const express = require("express");
const router = express.Router();

const Post = require("../models/Post.model");
const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware")

router.post("/posts", isAuthenticated, (req, res, next) => {
    const { image, comment, location, user } = req.body
    const id = req.payload._id;

    Post.create({ image, comment, location, user })
        .then( newPost => {
            const data = {
                posts: newPost,
            }
            
            return User.findByIdAndUpdate( id, data, {new: true} )
            
        })
        .then( updatedUser => {
            res.status(201).json(updatedUser)
        })
        .catch(err => {
            console.log("error creating post", err);
            res.status(500).json({
                message: "error creating a new post",
                error: err
            });
        })
})


router.get("/posts", (req, res, next) => {

    Post.find()
        .populate("user")
        .then( postsFromDB => {
            res.status(200).json(postsFromDB)
        })
        .catch(err => {
            console.log("error getting posts from DB", err);
            res.status(500).json({
                message: "error getting posts",
                error: err
            });
        })
})

router.delete("/posts/:postId", (req, res, next ) => {
    const { postId } = req.params;

    Post.findByIdAndDelete(postId)
        .then( response => {
            res.status(200).json(response)
        })
        .catch(err => {
            console.log("error deleting post from DB", err);
            res.status(500).json({
                message: "error deleting post from DB",
                error: err
            });
        })
})

module.exports = router;