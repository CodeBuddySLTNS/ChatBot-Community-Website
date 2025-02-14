const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
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
    whoLiked: [String],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user"
    }
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    likes: {
      type: Number,
      required: true
    },
    replies: [replySchema],
    whoLiked: [String],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user"
    }
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    date: {
      type: Date,
      required: true
    },
    likes: {
      type: Number,
      required: true,
      default: 0
    },
    whoLiked: [String],
    comments: [commentSchema],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);
