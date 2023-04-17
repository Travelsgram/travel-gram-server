const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
    {
        user:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        post:{
            type: Schema.Types.ObjectId,
            ref: "Post"
        },
        text:{
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        likes:[{
            type: Schema.Types.ObjectId,
            ref: "User"
        }]
    }
)

const Comment = model("Comment", commentSchema);

module.exports = Comment;