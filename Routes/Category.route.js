const { Router } = require("express");
const { authentication } = require("../Middleware/Authentication");
const { categoryModel } = require("../Model/Category.model");

const CategoryRouter = Router();

// Create Category
CategoryRouter.post("/add", async (req, res) => {
  try {
    const { name, slug, image } = req.body;
    const newCategory = new categoryModel({ name, slug, image });
    await newCategory.save();
    res
      .status(201)
      .json({ message: "Category created successfully", newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update Category
CategoryRouter.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, slug, image } = req.body;
    const category = await categoryModel.findByIdAndUpdate(id, {
      name,
      slug,
      image,
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all category
CategoryRouter.get("/", async (req, res) => {
  try {
    const name = req.query.name;
    let category;
    const regex = new RegExp(name, "i");
    category = await categoryModel.find({ name: { $regex: regex } });
    return res.send({
      category,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
});

// Single category by id
CategoryRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const category = await categoryModel.findById(id);

    return res.send({
      category,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
});

// Delete category
CategoryRouter.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    await categoryModel.findByIdAndDelete(id);
    let category = await categoryModel.find();

    return res.send({
      message: "deleted",
      category,
    });
  } catch (err) {
    return res.status(500).send({
      error: err.message,
    });
  }
});

module.exports = {
  CategoryRouter,
};
