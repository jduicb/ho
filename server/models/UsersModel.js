import DB from "../DB/config.js";
import bcrypt from 'bcrypt';

const usersModel = {
  findUserByEmail: async (email) => {
    const [rows] = await DB.query('SELECT * FROM Users WHERE email = ?', [email]);
    return rows[0];
  },

  findUserByUsername: async (username) => {
    const [rows] = await DB.query('SELECT * FROM Users WHERE username = ?', [username]);
    return rows[0];
  },

  addUser: async ({ username, password, email }) => {
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    const [result] = await DB.query(
      'INSERT INTO Users (username, password_hash, email) VALUES (?, ?, ?)',
      [username, password_hash, email]
    );
    
    return { 
      user_id: result.insertId, 
      username, 
      email,
      role: 'client'
    };
  },

  getAllUsers: async () => {
    const [rows] = await DB.query("SELECT user_id, username, email, role, created_at FROM Users");
    return rows;
  },

  getUserById: async (id) => {
    const [rows] = await DB.query("SELECT user_id, username, email, role, created_at FROM Users WHERE user_id = ?", [id]);
    return rows[0];
  },

  updateUser: async (id, userData) => {
    const { username, email, password } = userData;
    
    let query = "UPDATE Users SET username = ?, email = ? WHERE user_id = ?";
    let params = [username, email, id];
    
    if (password) {
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);
      query = "UPDATE Users SET username = ?, email = ?, password_hash = ? WHERE user_id = ?";
      params = [username, email, password_hash, id];
    }
    
    const [result] = await DB.query(query, params);
    return result;
  },

  deleteUser: async (id) => {
    const [result] = await DB.query("DELETE FROM Users WHERE user_id = ?", [id]);
    return result;
  },

  validatePassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};

export default usersModel;
