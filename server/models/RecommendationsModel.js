import DB from "../DB/config.js";

const recommendationsModel = {
  getAllRecommendations: (callback) => {
    DB.query("SELECT * FROM Recommendations", callback);
  },

  getRecommendationById: (id, callback) => {
    DB.query("SELECT * FROM Recommendations WHERE recommendation_id = ?", [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  addRecommendation: ({ personality_type_id, recommendation_text }, callback) => {
    DB.query(
      "INSERT INTO Recommendations (personality_type_id, recommendation_text) VALUES (?, ?)",
      [personality_type_id, recommendation_text],
      callback
    );
  },

  updateRecommendation: (id, { recommendation_text }, callback) => {
    DB.query(
      "UPDATE Recommendations SET recommendation_text = ? WHERE recommendation_id = ?",
      [recommendation_text, id],
      callback
    );
  },

  deleteRecommendation: (id, callback) => {
    DB.query("DELETE FROM Recommendations WHERE recommendation_id = ?", [id], callback);
  },
};

export default recommendationsModel;
