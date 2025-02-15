const viewModel = require("../database/models/view");
const resObject = require("../configs/response");
const { visitCountId } = require("../configs/server-config.json");

const views = async (req, res) => {
  try {
    // await viewModel.findOneAndUpdate({ _id: visitCountId }, { count: 0 }, { new: true });
    const incremented = await viewModel.findOneAndUpdate(
      { _id: visitCountId },
      { $inc: { count: 1 } },
      { new: true }
    );
    res.json(resObject(incremented, true));
  } catch (e) {
    res.json(resObject(null, false, "Unable to fetch views"));
  }
};

module.exports = { views };
