import categoriesModel from "../models/CategoriesModel.js";

const CategoriesController = {
  getAll: (req, res) => {
    categoriesModel.getAllCategories((err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(data);
    });
  },
  getById: (req, res) => {
    categoriesModel.getCategoryById(req.params.id, (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!data) return res.status(404).json({ message: "Not found" });
      res.json(data);
    });
  },
  add: (req, res) => {
    categoriesModel.addCategory(req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Added", result });
    });
  },
  update: (req, res) => {
    categoriesModel.updateCategory(req.params.id, req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Updated", result });
    });
  },
  delete: (req, res) => {
    categoriesModel.deleteCategory(req.params.id, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Deleted" });
    });
  },
};
export default CategoriesController;
