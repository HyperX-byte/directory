const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 40
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 40
    },
    date_of_birth:{
      type: String,
      required: true,
      trim: true
    },
    contact: { type: String },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true
    },
    hash_password: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    address: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

userSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  }
};

module.exports = mongoose.model("User", userSchema);
