const postModel = require("../database/models/post");
const userModel = require("../database/models/user");
const resObject = require("../configs/response");

const getPosts = async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      const post = await postModel.findOne({ _id: id }).populate("author").populate("comments.author");
      res.json(resObject(post, true));
      return;
    }
    const posts = await postModel.find({}).sort({ createdAt: -1 }).populate("author").populate("comments.author");
    res.json(resObject(posts, true));
  } catch (e) {
    res.json(resObject(null, false, "Failed to fetch posts."));
    console.log(e);
  }
};

const addPost = async (req, res) => {
  try {
    const post = req.body;
    const { userId } = res.locals;

    if (!post.message) return res.json(resObject(null, false, "Message of post is mandatory."));

    const user = await userModel.findOne({ _id: userId });

    if (!user) return res.json(resObject({ authError: true }, false, "You are not authorized to do this action."));

    post.author = user._id;
    post.date = new Date();

    const create = await postModel.create(post);
    res.json(resObject(create, true));
  } catch (e) {
    res.json(resObject(null, false, "Failed to add post."));
    console.log(e);
  }
};

const addPostComment = async (req, res) => {
  try {
    const data = req.body;
    const { userId } = res.locals;

    if (!data.postId || !data.message) return res.json(resObject(null, false, "Message and postId of post is mandatory."));

    const user = await userModel.findOne({ _id: userId });

    if (!user) return res.json(resObject({ authError: true }, false, "You are not authorized to do this action."));

    data.author = user._id;
    data.date = new Date();

    const post = await postModel.findOne({ _id: data.postId });
    const addComment = await postModel
      .findOneAndUpdate({ _id: data.postId }, { comments: [...post.comments, data] }, { new: true })
      .populate("author")
      .populate("comments.author");

    res.json(resObject(addComment, true));
  } catch (e) {
    res.json(resObject(null, false, "Failed to add comment."));
    console.log(e);
  }
};

const likePost = async (req, res) => {
  try {
    const data = req.body;
    const { userId } = res.locals;

    if (!data.postId) return res.json(resObject(null, false, "PostId of post is mandatory."));

    const user = await userModel.findOne({ _id: userId });

    if (!user) return res.json(resObject({ authError: true }, false, "You are not authorized to do this action."));

    const filter = { _id: data.postId };

    const post = await postModel.findOne(filter);

    if (data.commentId) {
      return;
    }

    if (post.whoLiked.includes(userId)) {
      const update = await postModel
        .findOneAndUpdate(
          filter,
          {
            likes: post.likes - 1,
            whoLiked: post.whoLiked.filter(a => a !== userId)
          },
          { new: true }
        )
        .populate("author")
        .populate("comments.author");
      res.json(resObject(update, true));
    } else {
      const update = await postModel
        .findOneAndUpdate(
          filter,
          {
            likes: post.likes + 1,
            whoLiked: [...post.whoLiked, userId]
          },
          { new: true }
        )
        .populate("author")
        .populate("comments.author");
      res.json(resObject(update, true));
    }
  } catch (e) {
    res.json(resObject(null, false, "Failed to like post / comment."));
    console.log(e);
  }
};

module.exports = {
  getPosts,
  addPost,
  addPostComment,
  likePost
};
