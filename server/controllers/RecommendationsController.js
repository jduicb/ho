import recommendationsModel from "../models/RecommendationsModel.js";

const RecommendationsController = {
  getAll: (req, res) => {
    recommendationsModel.getAllRecommendations((err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(data);
    });
  },
  getById: (req, res) => {
    recommendationsModel.getRecommendationById(req.params.id, (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!data) return res.status(404).json({ message: "Not found" });
      res.json(data);
    });
  },
  add: (req, res) => {
    recommendationsModel.addRecommendation(req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Added", result });
    });
  },
  update: (req, res) => {
    recommendationsModel.updateRecommendation(req.params.id, req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Updated", result });
    });
  },
  delete: (req, res) => {
    recommendationsModel.deleteRecommendation(req.params.id, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Deleted" });
    });
  },
};

export default RecommendationsController;
