const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    postId: {
      type: String,
      require: true,
    },
    desc: {
      type: String,
      require: true,
    },
    parentId: {
      type: String,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    username: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentsSchema);
