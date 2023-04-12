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
      default: "xxx"
    },
    birthdate: {
      type: date,
      required: false
    },
    location:{
      type: string,
      required: true
    },
    followers:[{
      type: Schema.Types.ObjectId,
      ref: "User"
    }],
    posts:[{
      type: Schema.Types.ObjectId,
      ref: "Post"
    }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
