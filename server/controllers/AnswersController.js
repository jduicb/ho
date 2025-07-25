import answersModel from "../models/AnswersModel.js";

const AnswersController = {
  getAll: (req, res) => {
    answersModel.getAllAnswers((err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(data);
    });
  },
  getById: (req, res) => {
    answersModel.getAnswerById(req.params.id, (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!data) return res.status(404).json({ message: "Not found" });
      res.json(data);
    });
  },
  add: (req, res) => {
    answersModel.addAnswer(req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Added", result });
    });
  },
  update: (req, res) => {
    answersModel.updateAnswer(req.params.id, req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Updated", result });
    });
  },
  delete: (req, res) => {
    answersModel.deleteAnswer(req.params.id, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Deleted" });
    });
  },
};

export default AnswersController;
