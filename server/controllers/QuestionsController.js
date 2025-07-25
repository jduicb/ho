import questionsModel from "../models/QuestionsModel.js";

const QuestionsController = {
  getAll: (req, res) => {
    questionsModel.getAllQuestions((err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(data);
    });
  },
  getById: (req, res) => {
    questionsModel.getQuestionById(req.params.id, (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!data) return res.status(404).json({ message: "Not found" });
      res.json(data);
    });
  },
  add: (req, res) => {
    questionsModel.addQuestion(req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Added", result });
    });
  },
  update: (req, res) => {
    questionsModel.updateQuestion(req.params.id, req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Updated", result });
    });
  },
  delete: (req, res) => {
    questionsModel.deleteQuestion(req.params.id, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Deleted" });
    });
  },
};

export default QuestionsController;
