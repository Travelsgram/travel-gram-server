const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Travelguide = require('../models/Travelguide.model');
const User = require("../models/User.model")

const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST /api/travelguide
router.post("/travelguide", isAuthenticated, (req,res,next) => {
    const {title, image, location, description, activities, tips, user} = req.body;
    const id = req.payload._id;

    Travelguide.create ({ title, image, activities, tips, location, description, user })
    .then(response => {
        const data = {
            travelguides: response,
        }

        return User.findByIdAndUpdate( id, data, {new:true} )

    })
    .then( updatedUser => {
        res.status(201).json(updatedUser)
    })
    .catch(err => {
        console.log("error creating a new travelguide", err);
        res.status(500).json({
            message: "error creating a new travelguide",
            error: err
        });
    })
});


// GET /api/travelguide
router.get("/travelguide", (req, res, next) => {
    Travelguide.find()
        .populate("user")
        .then(travelguideFromDB => {
            res.json(travelguideFromDB);
        })
        .catch(err => {
            console.log("error getting list of travelguide", err);
            res.status(500).json({
                message: "error getting list of travelguide",
                error: err
            });
        })
});



// GET /api/travelguide/:travelguideId
router.get('/travelguide/:travelguideId', (req, res, next) => {
    const { travelguideId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(travelguideId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    
    Travelguide.findById(travelguideId)
        .populate('user')
        .then(project => res.json(project))
        .catch(err => {
            console.log("error getting details of a post", err);
            res.status(500).json({
                message: "error getting details of a post",
                error: err
            });
        })
});

router.delete('/travelguide/:travelguideId', (req, res, next) => {
    const { travelguideId } = req.params;

    Travelguide.findByIdAndDelete(travelguideId)
        .then( response => {
            res.status(200).json(response)
        })
        .catch(err => {
            console.log("error deleting travelguide from DB", err);
            res.status(500).json({
                message: "error deleting travelguide from DB",
                error: err
            });
        })
})

module.exports = router;