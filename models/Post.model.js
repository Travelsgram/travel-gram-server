const { Schema, model } = require("mongoose");

const postSchema = new Schema(
{
    image:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    tags:{
        type: [String],
        required: false
    },
    likes:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    comments:[{
        type: Schema.Types.ObjectId,
        ref: "Comment"
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
