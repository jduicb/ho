import DB from "../DB/config.js";

const questionnairesModel = {
  getAllQuestionnaires: (callback) => {
    DB.query("SELECT * FROM Questionnaires", callback);
  },

  getQuestionnaireById: (id, callback) => {
    DB.query("SELECT * FROM Questionnaires WHERE questionnaire_id = ?", [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  addQuestionnaire: ({ title, description, created_by }, callback) => {
    DB.query(
      "INSERT INTO Questionnaires (title, description, created_by) VALUES (?, ?, ?)",
      [title, description, created_by],
      callback
    );
  },

  updateQuestionnaire: (id, { title, description }, callback) => {
    DB.query(
      "UPDATE Questionnaires SET title = ?, description = ? WHERE questionnaire_id = ?",
      [title, description, id],
      callback
    );
  },

  deleteQuestionnaire: (id, callback) => {
    DB.query("DELETE FROM Questionnaires WHERE questionnaire_id = ?", [id], callback);
  },
};

export default questionnairesModel;
