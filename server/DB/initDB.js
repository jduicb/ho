import DB from './config.js';

// שאילתות יצירת טבלאות לפרויקט השאלונים

const Users = `
  CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'client') NOT NULL DEFAULT 'client',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

const Categories = `
  CREATE TABLE IF NOT EXISTS Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
  );
`;

const Questionnaires = `
  CREATE TABLE IF NOT EXISTS Questionnaires (
    questionnaire_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Users(user_id) ON DELETE SET NULL
  );
`;

const Questions = `
  CREATE TABLE IF NOT EXISTS Questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    questionnaire_id INT,
    category_id INT,
    question_text TEXT NOT NULL,
    FOREIGN KEY (questionnaire_id) REFERENCES Questionnaires(questionnaire_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE SET NULL
  );
`;

const Answers = `
  CREATE TABLE IF NOT EXISTS Answers (
    answer_id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT,
    answer_text TEXT NOT NULL,
    value INT NOT NULL,
    FOREIGN KEY (question_id) REFERENCES Questions(question_id) ON DELETE CASCADE
  );
`;

const UserResponses = `
  CREATE TABLE IF NOT EXISTS UserResponses (
    response_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    question_id INT,
    answer_id INT,
    answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES Questions(question_id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES Answers(answer_id) ON DELETE CASCADE
  );
`;

const PersonalityTypes = `
  CREATE TABLE IF NOT EXISTS PersonalityTypes (
    type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL,
    description TEXT
  );
`;

const QuestionnaireResults = `
  CREATE TABLE IF NOT EXISTS QuestionnaireResults (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    questionnaire_id INT,
    personality_type_id INT,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (questionnaire_id) REFERENCES Questionnaires(questionnaire_id) ON DELETE CASCADE,
    FOREIGN KEY (personality_type_id) REFERENCES PersonalityTypes(type_id) ON DELETE SET NULL
  );
`;

const Recommendations = `
  CREATE TABLE IF NOT EXISTS Recommendations (
    recommendation_id INT AUTO_INCREMENT PRIMARY KEY,
    personality_type_id INT,
    recommendation_text TEXT NOT NULL,
    FOREIGN KEY (personality_type_id) REFERENCES PersonalityTypes(type_id) ON DELETE CASCADE
  );
`;

// הרצת השאילתות

DB.query(Users, (err) => {
  if (err) console.error("❌ Error creating Users table:", err);
  else console.log("✅ Users table created successfully.");
});

DB.query(Categories, (err) => {
  if (err) console.error("❌ Error creating Categories table:", err);
  else console.log("✅ Categories table created successfully.");
});

DB.query(Questionnaires, (err) => {
  if (err) console.error("❌ Error creating Questionnaires table:", err);
  else console.log("✅ Questionnaires table created successfully.");
});

DB.query(Questions, (err) => {
  if (err) console.error("❌ Error creating Questions table:", err);
  else console.log("✅ Questions table created successfully.");
});

DB.query(Answers, (err) => {
  if (err) console.error("❌ Error creating Answers table:", err);
  else console.log("✅ Answers table created successfully.");
});

DB.query(UserResponses, (err) => {
  if (err) console.error("❌ Error creating UserResponses table:", err);
  else console.log("✅ UserResponses table created successfully.");
});

DB.query(PersonalityTypes, (err) => {
  if (err) console.error("❌ Error creating PersonalityTypes table:", err);
  else console.log("✅ PersonalityTypes table created successfully.");
});

DB.query(QuestionnaireResults, (err) => {
  if (err) console.error("❌ Error creating QuestionnaireResults table:", err);
  else console.log("✅ QuestionnaireResults table created successfully.");
});

DB.query(Recommendations, (err) => {
  if (err) console.error("❌ Error creating Recommendations table:", err);
  else console.log("✅ Recommendations table created successfully.");
});

// סיום חיבור
// DB.end();
