import userResponsesModel from "../models/UserResponsesModel.js";

const UserResponsesController = {
  getAll: (req, res) => {
    userResponsesModel.getAllResponses((err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(data);
    });
  },

  getById: (req, res) => {
    userResponsesModel.getResponseById(req.params.id, (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!data) return res.status(404).json({ message: "Not found" });
      res.json(data);
    });
  },

  addResponse: (req, res) => {
    userResponsesModel.addResponse(req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Added", result });
    });
  },

  update: (req, res) => {
    userResponsesModel.updateResponse(req.params.id, req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Updated", result });
    });
  },

  delete: (req, res) => {
    userResponsesModel.deleteResponse(req.params.id, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Deleted" });
    });
  },
};

export default UserResponsesController;
