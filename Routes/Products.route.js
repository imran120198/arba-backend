const { Router } = require("express");
const { authentication } = require("../Middleware/Authentication");
const { productModel } = require("../Model/Product.model");

const ProductRouter = Router();

ProductRouter.post("/add", async (req, res) => {
  try {
    const data = req.body;
    let product = new productModel(data);
    await product.save();
    return res.send({
      message: "Product added successfully",
      product: product,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
});

ProductRouter.get("/getall", async (req, res) => {
  try {
    let title = req.query.title;
    let price = req.query.price;
    let sort;
    price == "lth" ? (sort = 1) : (sort = -1);
    const regex1 = new RegExp(title, "i");
    let Products;
    if (price) {
      Products = await productModel.find({ title: { $regex: regex1 } }).sort({
        price: sort,
      });
    } else Products = await productModel.find({ title: { $regex: regex1 } });

    return res.send({
      Products,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
});

ProductRouter.get("/get/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productModel.findById(id);
    return res.send({
      product,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
});

ProductRouter.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    console.log(id, data);
    await productModel.findByIdAndUpdate(id, data);
    let product = await productModel.find();
    return res.send({
      message: "updated",
      product,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
});

ProductRouter.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await productModel.findByIdAndDelete(id);
    const Products = await productModel.find();
    return res.send({
      message: "deleted",
      Products,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
});

module.exports = {
  ProductRouter,
};
