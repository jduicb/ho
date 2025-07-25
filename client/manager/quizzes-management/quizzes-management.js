document.addEventListener('DOMContentLoaded', () => {
    const quizzesList = document.getElementById('quizzes-list');
    const addQuizBtn = document.getElementById('add-quiz-btn');
  
    // דוגמאות נתונים סטטיים - אפשר להחליף בנתונים דינמיים עם API
    const quizzes = [
      { id: 1, name: 'טיפוסי אישיות', description: 'שאלון לבדיקת סוגי אישיות' },
      { id: 2, name: 'חוזקות וכישורים', description: 'גלה את החוזקות שלך' },
    ];
  
    function renderQuizzes() {
      quizzesList.innerHTML = '';
      quizzes.forEach((quiz) => {
        const tr = document.createElement('tr');
  
        tr.innerHTML = `
          <td>${quiz.name}</td>
          <td>${quiz.description}</td>
          <td>
            <button class="btn btn-outline edit-btn" data-id="${quiz.id}">ערוך</button>
            <button class="btn btn-outline delete-btn" data-id="${quiz.id}">מחק</button>
          </td>
        `;
  
        quizzesList.appendChild(tr);
      });
    }
  
    addQuizBtn.addEventListener('click', () => {
      alert('פונקציונליות הוספת שאלון תיושם כאן.');
    });
  
    quizzesList.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-btn')) {
        const id = e.target.dataset.id;
        alert(`עריכת שאלון עם מזהה: ${id}`);
      }
      if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        alert(`מחיקת שאלון עם מזהה: ${id}`);
      }
    });
  
    renderQuizzes();
  });
  