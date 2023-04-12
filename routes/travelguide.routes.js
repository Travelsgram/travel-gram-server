const express = require("express");
const router = express.Router();
const Travelguide = require('../models/Travelguide.model');
const mongoose = require("mongoose");


// POST /api/travelguide
router.post("/travelguide", (req,res,next) => {
    const {title, image, location, description, activities, tips} = req.body;

    Travelguide.create ({ title, image, location, description, activities, tips})
    .then(response => res.status(201).json(response))
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
