import DB from "../DB/config.js";

const questionsModel = {
  getAllQuestions: (callback) => {
    DB.query("SELECT * FROM Questions", callback);
  },

  getQuestionById: (id, callback) => {
    DB.query("SELECT * FROM Questions WHERE question_id = ?", [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  addQuestion: ({ questionnaire_id, category_id, question_text }, callback) => {
    DB.query(
      "INSERT INTO Questions (questionnaire_id, category_id, question_text) VALUES (?, ?, ?)",
      [questionnaire_id, category_id, question_text],
      callback
    );
  },

  updateQuestion: (id, { question_text }, callback) => {
    DB.query(
      "UPDATE Questions SET question_text = ? WHERE question_id = ?",
      [question_text, id],
      callback
    );
  },

  deleteQuestion: (id, callback) => {
    DB.query("DELETE FROM Questions WHERE question_id = ?", [id], callback);
  },
};

export default questionsModel;
