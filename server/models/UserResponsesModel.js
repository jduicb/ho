import DB from "../DB/config.js";

const userResponsesModel = {
  getAllResponses: (callback) => {
    DB.query("SELECT * FROM UserResponses", callback);
  },

  getResponseById: (id, callback) => {
    DB.query("SELECT * FROM UserResponses WHERE response_id = ?", [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  addResponse: ({ user_id, question_id, answer_id }, callback) => {
    DB.query(
      "INSERT INTO UserResponses (user_id, question_id, answer_id) VALUES (?, ?, ?)",
      [user_id, question_id, answer_id],
      callback
    );
  },

  updateResponse: (id, { user_id, question_id, answer_id }, callback) => {
    DB.query(
      "UPDATE UserResponses SET user_id = ?, question_id = ?, answer_id = ? WHERE response_id = ?",
      [user_id, question_id, answer_id, id],
      callback
    );
  },

  deleteResponse: (id, callback) => {
    DB.query("DELETE FROM UserResponses WHERE response_id = ?", [id], callback);
  },
};

export default userResponsesModel;
