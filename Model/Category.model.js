const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  name: String,
  slug: String,
  image: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const categoryModel = mongoose.model("category", CategorySchema);

module.exports = {
  categoryModel,
};
