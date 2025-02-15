const userModel = require("../database/models/user");
const resObject = require("../configs/response");

const getUserInfo = async (req, res) => {
  try {
    const { userId } = res.locals;
    const user = await userModel.findOne({ _id: userId });

    if (!user)
      return res.json(
        resObject({ authError: true }, false, "You are not logged in.")
      );

    const userData = {
      _id: user._id,
      name: user.name,
      img: user.img,
      username: user.username,
      role: user.role
    };
    res.json(resObject(userData, true, "User found."));
  } catch (e) {
    console.log(e);
    res.json(resObject(null, false, "User ID from token not found."));
  }
};

const getManagement = async (req, res) => {
  try {
    const users = await userModel.find({});
    const usersData = users.map(user => ({
      _id: user._id,
      name: user.name,
      img: user.img,
      username: user.username,
      role: user.role
    }));
    const management = usersData.filter(u =>
      u.role == "Admin" || u.role == "Moderator" ? true : false
    );
    res.json(resObject(management, true));
  } catch (e) {
    console.log(e);
    res.json(
      resObject(null, false, "There was an error getting all the users.")
    );
  }
};

const getUsers = async (req, res) => {
  try {
    const { userId } = res.locals;
    const user = await userModel.findOne({ _id: userId });

    if (!user)
      return res.json(
        resObject(
          { authError: true },
          false,
          "You are not authorized to do this action."
        )
      );

    if (user?.role === "Admin") {
      const users = await userModel.find({});
      const usersData = users.map(user => ({
        id: user._id,
        name: user.name,
        img: user.img,
        username: user.username,
        role: user.role
      }));
      res.json(resObject(usersData, true));
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
    console.log(e);
    res.json(
      resObject(null, false, "There was an error getting all the users.")
    );
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id, q, del } = req.body;
    const { userId } = res.locals;
    const qList = ["Admin", "Moderator", "Member"];

    if (!id || !q)
      return res.json(
        resObject(null, false, "Id of user and query is mandatory.")
      );

    if (!qList.includes(q))
      return res.json(resObject(null, false, "Invalid query."));

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

    const user = await userModel.findOne({ _id: userId });

    if (user.role == "Admin") {
      if (del) {
        const deleteUser = await userModel.findOneAndDelete({ _id: id });
        res.json(resObject({ id }, true));
        return;
      }
      const update = await userModel.findOneAndUpdate(
        { _id: id },
        { role: q },
        { new: true }
      );
      res.json(
        resObject(
          {
            id: update._id,
            name: update.name,
            img: update.img,
            username: update.username,
            role: update.role
          },
          true
        )
      );
    } else {
      res.json(
        resObject(
          {
            authError: true,
            message: "Not logged in."
          },
          false
        )
      );
    }
  } catch (e) {
    console.log(e);
    res.json(
      resObject(null, false, "There was an error updating user profile.")
    );
  }
};

module.exports = {
  getUserInfo,
  getUsers,
  getManagement,
  updateProfile
};
