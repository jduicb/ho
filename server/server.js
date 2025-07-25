import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

// ייבוא כל הראוטרים מתיקיית routers
import usersRoutes from './routers/UsersRoutes.js';
import questionsRoutes from './routers/QuestionsRoutes.js';
import categoriesRoutes from './routers/CategoriesRoutes.js';
import answersRoutes from './routers/AnswersRoutes.js';
import personalityTypeId from './routers/PersonalityTypesRoutes.js';
import QuestionnaireResultsRoutes from './routers/QuestionnaireResultsRoutes.js';
import QuestionnairesRoutes from './routers/QuestionnairesRoutes.js';
import RecommendationsRoutes from './routers/RecommendationsRoutes.js';
import UserResponsesRoutes from './routers/UserResponsesRoutes.js';

const app = express();
const PORT = process.env.PORT || 5500;

// הגדרות בסיסיות
app.use(express.json());
app.use(cors());

// מסד נתונים זמני בזיכרון (אם אתה עדיין צריך אותו לבדיקות)
const users = [];

// === שימוש בראוטרים ===
app.use('/api/users', usersRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/answers', answersRoutes);
app.use('/api/personalityTypeId', personalityTypeId);
app.use('/api/questionnaireresults', QuestionnaireResultsRoutes);
app.use('/api/questionnaire', QuestionnairesRoutes);
app.use('/api/recommendations', RecommendationsRoutes);
app.use('/api/userResponses', UserResponsesRoutes);

// דף הבית
app.get('/', (req, res) => {
  res.json({
    message: '🚀 השרת של מבחן האישיות רץ ועובד!',
    endpoints: {
      register: 'POST /api/users/register',
      login: 'POST /api/users/login (requires token)',
      profile: 'GET /api/users/profile (requires token)',
      verify: 'GET /api/users/verify (requires token)'
    }
  });
});

// מסלול לבדיקת בריאות השרת
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// טיפול בשגיאות 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'המסלול לא נמצא',
    requested: req.originalUrl,
    method: req.method
  });
});

// טיפול בשגיאות כלליות
app.use((error, req, res, next) => {
  console.error('שגיאה בשרת:', error);
  res.status(500).json({
    error: 'שגיאה פנימית בשרת',
    message: error.message
  });
});

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`✅ השרת מאזין על http://localhost:${PORT}`);
  console.log(`📝 נקודות קצה זמינות:`);
  console.log(`   POST /api/users/register - הרשמה`);
  console.log(`   POST /api/users/login - התחברות`);
  console.log(`   GET /api/users/profile - פרופיל משתמש`);
  console.log(`   GET /api/users/verify - בדיקת טוכן`);
  console.log(`   GET /api/health - בדיקת בריאות השרת`);
});