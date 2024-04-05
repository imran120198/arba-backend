const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  image: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const productModel = mongoose.model("Product", productSchema);

module.exports = {
  productModel,
};
