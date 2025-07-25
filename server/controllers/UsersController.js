import usersModel from "../models/UsersModel.js";

/** ממפה רשומה מה-DB לאובייקט משתמש “נקי” */
const mapUserRow = (row) => ({
  id: row.user_id,
  username: row.username,
  email: row.email,
  role: row.role,
  created_at: row.created_at
});

/* ----------  הרשמת משתמש  ---------- */
export const registerUser = async (req, res) => {
  const { username, password, email, name } = req.body;
  const finalUsername = username || name;

  if (!finalUsername || !password || !email) {
    return res
      .status(400)
      .json({ error: "יש למלא את כל השדות הנדרשים." });
  }

  try {
    const existingUser = await usersModel.findUserByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "האימייל כבר קיים במערכת." });
    }

    const existingUsername = await usersModel.findUserByUsername(
      finalUsername
    );
    if (existingUsername) {
      return res
        .status(409)
        .json({ error: "שם המשתמש כבר קיים במערכת." });
    }

    const newUser = await usersModel.addUser({
      username: finalUsername,
      password,
      email
    });

    res.status(201).json({
      message: "המשתמש נרשם בהצלחה.",
      user: {
        id: newUser.user_id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("שגיאה ברישום:", error);
    res.status(500).json({ error: "שגיאה בשרת." });
  }
};

/* ----------  פעולות CRUD נוספות  ---------- */
const UsersController = {
  /** החזרת כל המשתמשים (ללא req/res) */
  getAll: async () => {
    const rows = await usersModel.getAllUsers();
    return rows.map(mapUserRow);
  },

  /** משתמש לפי מזהה */
  getById: async (id) => {
    const row = await usersModel.getUserById(id);
    return row ? mapUserRow(row) : null;
  },

  /** משתמש לפי אימייל (כולל password_hash להשוואה בזמן login) */
  getByEmail: async (email) => {
    const row = await usersModel.findUserByEmail(email);
    if (!row) return null;
    return {
      ...mapUserRow(row),
      password_hash: row.password_hash
    };
  },

  /** הוספת משתמש (נקרא ישירות מה-router עם req/res) */
  add: async (req, res) => {
    try {
      const newUser = await usersModel.addUser(req.body);
      res.json({ message: "Added", result: newUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /** עדכון משתמש */
  update: async (req, res) => {
    try {
      const updated = await usersModel.updateUser(
        req.params.id,
        req.body
      );
      res.json({ message: "Updated", result: updated });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /** מחיקת משתמש */
  delete: async (req, res) => {
    try {
      await usersModel.deleteUser(req.params.id);
      res.json({ message: "Deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default UsersController;
