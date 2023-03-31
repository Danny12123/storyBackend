const Comments = require('../models/Comments');
const Post = require('../models/Post')
const router = require("express").Router();


// make a comment
router.post("/",async (req, res, next) => {
  const newComment = new Comments({ ...req.body });
  try {
    const saveComment = await newComment.save();
    res.status(200).send(saveComment);
  } catch (err) {
    next(err);
  }
}
);
//delete comment
router.delete("/delete/:id", async (req, res, next) => {
  try {
    const comment = await Comments.findById(res.params._id);
    const post = await Post.findById(res.params._id);
    if (req.user._id === comment.userId || req.user._id === post.userId) {
      await Comments.findByIdAndDelete(req.params.id);
      res.status(200).json("The comment has been deleted");
    } else {
      return next(createError(403, "You can delete only your comment"));
    }
  } catch (err) {
   
  }
});
//get comment
router.get("/:postId", async (req, res, next) => {
  try {
    // const comment = await Comments.findById(req.params._id);
    const comment = await Comments.find({ postId: req.params.postId });
    res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
}
);

//like a post
router.put("/acomment/:id/like", async (req, res) => {
  try {
    const post = await Comments.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;