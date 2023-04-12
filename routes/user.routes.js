const express = require("express");
const router = express.Router();

const User = require("../models/User.model");


router.get("/users", (req, res, next) => {

    User.find()
        .then( usersFromDB => {
            res.status(201).json(usersFromDB)
        })
        .catch( err => console.log("error getting users from DB", err))
})

router.get("/users/:id", (req, res, next) => {
    const {id} = req.params

    User.findById(id)
        .then( user => {
            res.status(201).json(user)
        })
        .catch( err => console.log("error finding user by id", err))
})

router.put("/users/:id", (req, res, next) => {
    const { id } = req.params;
    const { email, name, profileImg, location, } = req.body

    User.findByIdAndUpdate(id, {email, name, profileImg, location }, { new: true})
        .then(updatedUser => {
            res.status(200).json(updatedUser)
        })
        .catch( err => console.log("error updating user", err))

})

router.delete("/users/:id", (req, res, next) => {
    const {id} = req.params

    User.findByIdAndDelete(id)
        .then( response => {
            res.status(201).json(response)
        })
        .catch( err => console.log("error deleting user", err))
})


module.exports = router;