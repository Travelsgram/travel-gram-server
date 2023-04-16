const express = require("express");
const router = express.Router();
const fileUploader = require("../config/cloudinary.config");
const Post = require("../models/Post.model");
const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware")

router.post("/posts", isAuthenticated, (req, res, next) => {
    const { image, comment, location, user } = req.body
    const id = req.payload._id;

    Post.create({ image, comment, location, user })
        .then( newPost => {
           const { _id, image, comment, location, user } = newPost;
            
            return User.findByIdAndUpdate( id, {$push: {"posts": { _id, image, comment, location, user:id }}}, {safe: true, upsert: true, new : true})
            
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

router.get("/posts/:postId", isAuthenticated, (req, res, next) => {
    const { postId } = req.params;
    const _id = req.payload._id;

    Post.findById(postId)
        .populate("likes")
        .then( response => {
            let userInLikes = false;
            response.likes.forEach( element => {
                if(element.name === req.payload.name){
                    userInLikes = true;
                }
            })
            if(!userInLikes){
               return Post.findByIdAndUpdate( postId, {$push: {"likes": { _id }}}, {safe: true, upsert: true, new : true})
            }/*else{
                console.log(_id)
                return Post.findByIdAndUpdate( postId, {$pull: {"likes":  {_id:new ObjectId(_id)} }}, {safe: true,})
            }*/
        })
    /*Post.findById(postId,{ likes: { $elemMatch:  {_id:new ObjectId(_id)} }})
        .then( postFromDB => {
            console.log(postFromDB);
            if(!postFromDB._id){
                return Post.findByIdAndUpdate( postId, {$push: {"likes": { _id }}}, {safe: true, upsert: true, new : true})
            }       
            
        })*/
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