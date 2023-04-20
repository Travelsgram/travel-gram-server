const express = require("express");
const router = express.Router();
const fileUploader = require("../config/cloudinary.config");
const Post = require("../models/Post.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");

const { isAuthenticated } = require("../middleware/jwt.middleware")

router.post("/posts", isAuthenticated, (req, res, next) => {
    const { image, description, location, tags, user } = req.body
    const id = req.payload._id;

    Post.create({ image, description, location, tags, user })
        .then( newPost => {
           const { _id, image, description, location, tags, user } = newPost;
           console.log(newPost)
            
            return User.findByIdAndUpdate( id, {$push: {"posts": { _id, image, description, location, tags, user:id }}}, {safe: true, upsert: true, new : true})
            
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

router.put("/posts", isAuthenticated, (req, res, next) => {
    const _id = req.payload._id;
    
    const { post_id, text} = req.body;
   
    Comment.create({ user:_id, post: post_id, text })
        .then( response => {
            const commentId = response.id 
            return Post.findByIdAndUpdate( post_id, {$push: {"comments": commentId }}, {safe: true, upsert: true, new : true})
        })
        .then( response => {
            console.log(response)
            res.status(201).json(response)
        })
        .catch(err => {
            console.log("error adding comment to post", err);
            res.status(500).json({
                message: "error adding comment to post",
                error: err
            });
        })
})

// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("image"), (req, res, next) => {
    // console.log("file is: ", req.file)
   
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
    
    // Get the URL of the uploaded file and send it as a response.
    // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
    
    res.json({ fileUrl: req.file.path });
  });

router.get("/posts", (req, res, next) => {

    Post.find().sort({ createdAt: -1 })
        .populate("user")
        .populate("tags")
        .populate({
            path: "comments",
            populate: {
                path: "user"
            }
        })
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
router.get("/posts/:postId", isAuthenticated, (req, res, next) => {
    const { postId } = req.params;
    const _id = req.payload._id;

    Post.findById(postId)
        .populate("likes")
        .then( response => {
            let userInLikes = false;
            response.likes.forEach( element => {
                if(element.id === _id){
                    userInLikes = true;
                }
            })
            if(!userInLikes){
               return Post.findByIdAndUpdate( postId, {$push: {"likes": { _id }}}, {safe: true, upsert: true, new : true})
            }else{   
                return Post.findByIdAndUpdate( postId, {$pull: {"likes":  _id }}, {safe: true,})
            }
        })
        .then( updatedPost => {
            res.status(201).json(updatedPost)
        })
        .catch(err => {
            console.log("error creating new like", err);
            res.status(500).json({
                message: "error creating new like",
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