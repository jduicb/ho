import personalityTypesModel from "../models/PersonalityTypesModel.js";

const PersonalityTypesController = {
  getAll: (req, res) => {
    personalityTypesModel.getAllPersonalityTypes((err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(data);
    });
  },
  getById: (req, res) => {
    personalityTypesModel.getPersonalityTypeById(req.params.id, (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!data) return res.status(404).json({ message: "Not found" });
      res.json(data);
    });
  },
  addType: (req, res) => {
    personalityTypesModel.addType(req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Added", result });
    });
  },
  update: (req, res) => {
    personalityTypesModel.updatePersonalityType(req.params.id, req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Updated", result });
    });
  },
  delete: (req, res) => {
    personalityTypesModel.deletePersonalityType(req.params.id, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Deleted" });
    });
  },
};

export default PersonalityTypesController;
