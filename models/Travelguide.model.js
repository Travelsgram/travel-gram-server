const { Schema, model } = require("mongoose");

const travelguideSchema = new Schema(
    {
        image:{
            type: String,
            required: true
        },
        activities:{
            type: String,
            required: false
        },
        tips: {
            type: String,
            required: false
        },
        location:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        }

    }
)


const Travelguide = model("Travelguide", travelguideSchema);

module.exports = Travelguide;