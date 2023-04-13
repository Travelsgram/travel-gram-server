const { Schema, model } = require("mongoose");

const postSchema = new Schema(
{
    image:{
        type: String,
        required: true
    },
    comment:{
        type: String,
        required: false
    },
    location:{
        type: String,
        required: true
    },
    likes:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    user:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true,
})

const Post = model("Post", postSchema);

module.exports = Post;
