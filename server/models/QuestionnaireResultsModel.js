import DB from "../DB/config.js";

const questionnaireResultsModel = {
  getAllResults: (callback) => {
    DB.query("SELECT * FROM QuestionnaireResults", callback);
  },

  getResultById: (id, callback) => {
    DB.query("SELECT * FROM QuestionnaireResults WHERE result_id = ?", [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  addResult: ({ user_id, questionnaire_id, personality_type_id }, callback) => {
    DB.query(
      "INSERT INTO QuestionnaireResults (user_id, questionnaire_id, personality_type_id) VALUES (?, ?, ?)",
      [user_id, questionnaire_id, personality_type_id],
      callback
    );
  },

  deleteResult: (id, callback) => {
    DB.query("DELETE FROM QuestionnaireResults WHERE result_id = ?", [id], callback);
  },
};

export default questionnaireResultsModel;
