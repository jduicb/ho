import DB from "../DB/config.js";

const categoriesModel = {
  getAllCategories: (callback) => {
    DB.query("SELECT * FROM Categories", callback);
  },

  getCategoryById: (id, callback) => {
    DB.query("SELECT * FROM Categories WHERE category_id = ?", [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  addCategory: ({ category_name }, callback) => {
    DB.query(
      "INSERT INTO Categories (category_name) VALUES (?)",
      [category_name],
      callback
    );
  },

  updateCategory: (id, { category_name }, callback) => {
    DB.query(
      "UPDATE Categories SET category_name = ? WHERE category_id = ?",
      [category_name, id],
      callback
    );
  },

  deleteCategory: (id, callback) => {
    DB.query("DELETE FROM Categories WHERE category_id = ?", [id], callback);
  },
};

export default categoriesModel;
