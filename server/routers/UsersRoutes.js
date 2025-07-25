import express from 'express';
import jwt     from 'jsonwebtoken';

import UsersController, { registerUser } from '../controllers/UsersController.js';
import { authenticateToken }            from '../middleware/auth.js';
import UsersModel                        from '../models/UsersModel.js';

const router = express.Router();

/*-----------  רישום  -----------*/
router.post('/register', registerUser);

/* GET /register – הודעת הסבר אם נטען ידנית בדפדפן (לא חובה בפרודקשן) */
router.get('/register', (req, res) => {
  res.status(405).json({
    error: 'יש לשלוח בקשת POST עם נתוני משתמש כדי להירשם.'
  });
});

/*-----------  התחברות  -----------*/
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'יש למלא את כל השדות' });

  try {
    const user = await UsersController.getByEmail(email);
    if (!user) return res.status(401).json({ error: 'אימייל או סיסמה שגויים' });

    const ok = await UsersModel.validatePassword(password, user.password_hash);
    if (!ok)  return res.status(401).json({ error: 'אימייל או סיסמה שגויים' });

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, role: user.role || 'client' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user : { id: user.id, username: user.username, email: user.email, role: user.role },
      message: 'התחברת בהצלחה!'
    });
  } catch (err) {
    console.error('שגיאה בהתחברות:', err);
    res.status(500).json({ error: 'שגיאה בשרת' });
  }
});

/*-----------  בדיקת תקינות JWT  -----------*/
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user : {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role
    }
  });
});

/*-----------  פרופיל  -----------*/
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await UsersController.getById(req.user.id);
    if (!user) return res.status(404).json({ error: 'משתמש לא נמצא' });

    const { password_hash, ...profile } = user;
    res.json(profile);
  } catch (err) {
    console.error('שגיאה בקבלת פרופיל:', err);
    res.status(500).json({ error: 'שגיאה בשרת' });
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    req.params.id = req.user.id;
    req.body      = { username: req.body.username, email: req.body.email };
    await UsersController.update(req, res);
  } catch (err) {
    console.error('שגיאה בעדכון פרופיל:', err);
    res.status(500).json({ error: 'שגיאה בשרת' });
  }
});

/*-----------  CRUD כללי על משתמשים (לפי צורך) -----------*/
router.get('/', async (req, res) => {
  try       { res.json(await UsersController.getAll()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await UsersController.getById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/',  (req, res) => UsersController.add   (req, res));
router.put ('/:id', (req, res) => UsersController.update(req, res));
router.delete('/:id', (req, res) => UsersController.delete(req, res));

/*-----------  דוגמה – ראוט מאובטח פשוט -----------*/
router.get('/me', authenticateToken, (req, res) => {
  res.json({ message: `שלום ${req.user.username}`, user: req.user });
});

export default router;
