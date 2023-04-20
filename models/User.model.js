const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    profileImg: {
      type: String,
      default: "data:image/jpeg;base64,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"
    },
    birthdate: {
      type: Date,
      required: true
    },
    location:{
      type: String,
      required: true
    },
    followers:[{
      type: Schema.Types.ObjectId,
      ref: "User"
    }],
    posts:[{
      type: Schema.Types.ObjectId,
      ref: "Post"
    }],
    travelguides:[{
      type: Schema.Types.ObjectId,
      ref: "Travelguide"
    }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
