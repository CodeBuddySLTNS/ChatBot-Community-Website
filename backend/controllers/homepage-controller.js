// https://i.imgur.com/hcz65Qd.jpeg
// https://i.imgur.com/nK2ZdJM.jpeg
// 'Hello everyone! we are happy to inform you that this website is now the official website for our community.'
const announceModel = require("../database/models/announcement");
const userModel = require("../database/models/user");
const resObject = require("../configs/response");

const getAnnouncements = async (req, res) => {
  try {
    // return res.json(require("../sample_data/announcements.json"));
    const announcements = await announceModel.find({}).sort({ createdAt: -1 });
    res.json(resObject(announcements, true));
  } catch (e) {
    res.json(resObject(null, false, "Failed to fetch announcements."));
    console.log(e);
  }
};

const addAnnounce = async (req, res) => {
  try {
    const announce = req.body;
    const { userId } = res.locals;

    if (!announce.message)
      return res.json(
        resObject(null, false, "Message of announcement is mandatory.")
      );

    const user = await userModel.findOne({ _id: userId });

    if (!user)
      return res.json(
        resObject(
          { authError: true },
          false,
          "You are not authorized to do this action."
        )
      );

    announce.author = userId;
    announce.likes = 0;
    announce.whoLiked = [];

    if (user?.role === "Moderator" || user?.role === "Admin") {
      const create = await announceModel.create(announce);
      res.json(resObject(create, true));
    } else {
      return res.json(
        resObject(
          { authError: true },
          false,
          "You are not authorized to do this action."
        )
      );
    }
  } catch (e) {
    res.json(resObject(null, false, "Failed to add announcement."));
    console.log(e);
  }
};

const likeAnnounce = async (req, res) => {
  try {
    const filter = req.body;
    const { userId } = res.locals;

    if (!userId)
      return res.json(
        resObject(
          {
            authError: true,
            message: "Not logged in."
          },
          false
        )
      );

    if (!filter._id)
      return res.json(
        resObject(
          {
            message: "Id of announcement is mandatory."
          },
          false
        )
      );

    const announce = await announceModel.findOne(filter);

    if (announce.whoLiked.includes(userId)) {
      const update = await announceModel.findOneAndUpdate(
        filter,
        {
          likes: announce.likes - 1,
          liked: false,
          whoLiked: announce.whoLiked.filter(a => a !== userId)
        },
        { new: true }
      );
      res.json(resObject(update, true));
    } else {
      const update = await announceModel.findOneAndUpdate(
        filter,
        {
          likes: announce.likes + 1,
          liked: true,
          whoLiked: [...announce.whoLiked, userId]
        },
        { new: true }
      );
      res.json(resObject(update, true));
    }
  } catch (e) {
    res.json(
      resObject(
        { error: e.message },
        false,
        "Failed to like/unlike announcement."
      )
    );
    console.log(e);
  }
};

module.exports = {
  getAnnouncements,
  addAnnounce,
  likeAnnounce
};
