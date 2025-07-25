import DB from "../DB/config.js";

const answersModel = {
  getAllAnswers: (callback) => {
    DB.query("SELECT * FROM Answers", callback);
  },

  getAnswerById: (id, callback) => {
    DB.query("SELECT * FROM Answers WHERE answer_id = ?", [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  addAnswer: ({ question_id, answer_text, value }, callback) => {
    DB.query(
      "INSERT INTO Answers (question_id, answer_text, value) VALUES (?, ?, ?)",
      [question_id, answer_text, value],
      callback
    );
  },

  updateAnswer: (id, { answer_text, value }, callback) => {
    DB.query(
      "UPDATE Answers SET answer_text = ?, value = ? WHERE answer_id = ?",
      [answer_text, value, id],
      callback
    );
  },

  deleteAnswer: (id, callback) => {
    DB.query("DELETE FROM Answers WHERE answer_id = ?", [id], callback);
  },
};

export default answersModel;
