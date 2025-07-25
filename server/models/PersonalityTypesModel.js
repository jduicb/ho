import DB from "../DB/config.js";

const personalityTypesModel = {
  getAllTypes: (callback) => {
    DB.query("SELECT * FROM PersonalityTypes", callback);
  },

  getTypeById: (id, callback) => {
    DB.query("SELECT * FROM PersonalityTypes WHERE type_id = ?", [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  addType: ({ type_name, description }, callback) => {
    DB.query(
      "INSERT INTO PersonalityTypes (type_name, description) VALUES (?, ?)",
      [type_name, description],
      callback
    );
  },

  updateType: (id, { type_name, description }, callback) => {
    DB.query(
      "UPDATE PersonalityTypes SET type_name = ?, description = ? WHERE type_id = ?",
      [type_name, description, id],
      callback
    );
  },

  deleteType: (id, callback) => {
    DB.query("DELETE FROM PersonalityTypes WHERE type_id = ?", [id], callback);
  },
};

export default personalityTypesModel;
