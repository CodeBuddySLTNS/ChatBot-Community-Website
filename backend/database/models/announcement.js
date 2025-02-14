const mongoose = require("mongoose");

const announceSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user"
    },
    message: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    likes: {
      type: Number,
      required: true
    },
    whoLiked: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("announcement", announceSchema);
