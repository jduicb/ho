// רשימת שאלונים לדוגמה
const quizzes = [
    { title: 'טיפוסי אישיות', time: '10 דקות', rating: '4.8 ★' },
    { title: 'חוזקות וכישורים', time: '15 דקות', rating: '4.9 ★' },
    { title: 'התאמה לקריירה', time: '12 דקות', rating: '4.7 ★' },
    { title: 'סגנון למידה', time: '8 דקות', rating: '4.6 ★' }
  ];
  
  const quizzesList = document.getElementById('quizzes-list');
  
  function createQuizCard(quiz) {
    const card = document.createElement('div');
    card.className = 'quiz-card';
    card.tabIndex = 0; // לאפשר נגישות עם מקלדת
    card.innerHTML = `
      <div class="quiz-title">${quiz.title}</div>
      <div class="quiz-description">בחר שאלון בנושא ${quiz.title}</div>
      <div class="quiz-meta">
        <span>${quiz.time}</span>
        <span>${quiz.rating}</span>
      </div>
    `;
  
    // בעת לחיצה על כרטיס נעבור לדף שאלון לדוגמה (כאן רק הפניה)
    card.addEventListener('click', () => {
      alert(`מעבר לשאלון: ${quiz.title}`);
      // כאן ניתן לשים לוגיקה ניווט לדף שאלון ספציפי
      // למשל: window.location.href = `quiz_detail.html?quiz=${encodeURIComponent(quiz.title)}`;
    });
  
    return card;
  }
  
  function renderQuizzes() {
    quizzesList.innerHTML = '';
    quizzes.forEach(q => {
      const card = createQuizCard(q);
      quizzesList.appendChild(card);
    });
  }
  
  renderQuizzes();
  
  // כפתורי ניווט לדוגמה:
  document.getElementById('login-register-btn').addEventListener('click', () => {
    window.location.href = '../register/register.html'; // קישור לדף ההרשמה/התחברות
  });
  
  document.getElementById('admin-login-btn').addEventListener('click', () => {
    alert('כניסת מנהל תפתח כאן');
    // ניתן לפתוח מודאל מנהל או ניווט לעמוד מנהל
  });
  