// פונקציות עזר לניהול טוקן
function saveToken(token) {
  localStorage.setItem('authToken', token);
}

function getToken() {
  return localStorage.getItem('authToken');
}

function removeToken() {
  localStorage.removeItem('authToken');
}

function isLoggedIn() {
  return getToken() !== null;
}

document.addEventListener('DOMContentLoaded', () => {
  
  // בדיקה אם המשתמש מחובר כבר
  if (isLoggedIn()) {
      showLoggedInState();
  }

  // ניווט וטעינת דינמית
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const url = e.target.getAttribute('href');
      if (url) {
        window.location.href = url;
      }
    });
  });

  // כפתורי פעולה
  const startQuizBtn = document.getElementById('start-quiz-btn');
  const learnMoreBtn = document.getElementById('learn-more-btn');
  const loginRegisterBtn = document.getElementById('login-register-btn');
  const adminLoginBtn = document.getElementById('admin-login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const myProfileBtn = document.getElementById('my-profile-btn');
  const viewResultsBtn = document.getElementById('view-results-btn');

  if (startQuizBtn) {
    startQuizBtn.addEventListener('click', () => {
      if (!isLoggedIn()) {
          alert('עליך להתחבר כדי לבצע שאלון');
          if (loginRegisterBtn) loginRegisterBtn.click();
          return;
      }
      window.location.href = '../quizzes/quizzes.html';
    });
  }

  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => {
      window.location.href = '../about/about.html';
    });
  }

  if (loginRegisterBtn) {
    loginRegisterBtn.addEventListener('click', () => {
      window.location.href = '../register/register.html';
    });
  }

  if (viewResultsBtn) {
    viewResultsBtn.addEventListener('click', () => {
      if (!isLoggedIn()) {
          alert('עליך להתחבר כדי לצפות בתוצאות');
          if (loginRegisterBtn) loginRegisterBtn.click();
          return;
      }
      window.location.href = '../results/results.html';
    });
  }

  // התנתקות
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      removeToken();
      showLoggedOutState();
      alert('התנתקת בהצלחה!');
    });
  }

  // קבלת פרופיל משתמש
  if (myProfileBtn) {
    myProfileBtn.addEventListener('click', () => {
      if (!isLoggedIn()) {
          alert('עליך להתחבר כדי לצפות בפרופיל');
          if (loginRegisterBtn) loginRegisterBtn.click();
          return;
      }
      
      fetch('/api/users/profile', {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + getToken(),
              'Content-Type': 'application/json'
          }
      })
      .then(response => {
          if (!response.ok) {
              if (response.status === 401 || response.status === 403) {
                  removeToken();
                  showLoggedOutState();
                  alert('הפגישה פגה תוקף, אנא התחבר מחדש');
                  return;
              }
              throw new Error('שגיאה בקבלת פרופיל');
          }
          return response.json();
      })
      .then(data => {
          console.log('פרופיל המשתמש:', data);
          alert('שם: ' + data.username + '\nאימייל: ' + data.email);
      })
      .catch(error => {
          console.error('שגיאה:', error);
          alert('שגיאה בקבלת פרופיל המשתמש');
      });
    });
  }

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', () => {
      openAdminModal();
    });
  }

  // מודאל מנהל
  const adminModal = document.getElementById('admin-modal');
  if (adminModal) {
    const closeModalBtn = adminModal.querySelector('.close-modal');
    const adminLoginForm = document.getElementById('admin-login-form');

    function openAdminModal() {
      adminModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const usernameField = adminModal.querySelector('#admin-username');
      if (usernameField) {
        usernameField.focus();
      }
    }

    function closeAdminModal() {
      adminModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeAdminModal);
    }

    adminModal.addEventListener('click', (e) => {
      if (e.target === adminModal) {
        closeAdminModal();
      }
    });

    if (adminLoginForm) {
      adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = adminLoginForm['admin-username'].value.trim();
        const password = adminLoginForm['admin-password'].value.trim();

        if (username === '' || password === '') {
          alert('אנא מלא את כל השדות');
          return;
        }

        // שליחה לשרת לאימות מנהל
        fetch('/api/admin/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              username: username,
              password: password
          })
        })
        .then(response => {
          if (!response.ok) {
              throw new Error('שם משתמש או סיסמה שגויים');
          }
          return response.json();
        })
        .then(data => {
          console.log('כניסת מנהל הצליחה:', data);
          alert(`ברוכים הבאים, מנהל ${username}!`);
          
          // שמירת טוקן מנהל אם יש
          if (data.token) {
              localStorage.setItem('adminToken', data.token);
          }
          
          adminLoginForm.reset();
          closeAdminModal();
          
          // הפניה לדף מנהל
          window.location.href = '../admin/admin.html';
        })
        .catch(error => {
          console.error('שגיאה בכניסת מנהל:', error);
          alert('שגיאה: ' + error.message);
        });
      });
    }
  }

  // דינמיות בתוכן - שאלונים שנטענים מהשרת
  loadQuizzesFromServer();
  
  // המלצות שנטענות מהשרת
  loadTestimonialsFromServer();
});

// פונקציות עזר למצב משתמש
function showLoggedInState(user) {
  const loggedOutButtons = document.getElementById('logged-out-buttons');
  const loggedInButtons = document.getElementById('logged-in-buttons');
  const loggedInContent = document.getElementById('logged-in-content');
  const loginRegisterBtn = document.getElementById('login-register-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const userName = document.getElementById('user-name');
  
  if (loggedOutButtons) loggedOutButtons.style.display = 'none';
  if (loginRegisterBtn) loginRegisterBtn.style.display = 'none';
  
  if (loggedInButtons) loggedInButtons.style.display = 'block';
  if (loggedInContent) loggedInContent.style.display = 'block';
  if (logoutBtn) logoutBtn.style.display = 'block';
  
  if (user && userName && (user.name || user.username)) {
      userName.textContent = 'שלום, ' + (user.name || user.username);
  }
}

function showLoggedOutState() {
  const loggedOutButtons = document.getElementById('logged-out-buttons');
  const loggedInButtons = document.getElementById('logged-in-buttons');
  const loggedInContent = document.getElementById('logged-in-content');
  const loginRegisterBtn = document.getElementById('login-register-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const userName = document.getElementById('user-name');
  
  if (loggedOutButtons) loggedOutButtons.style.display = 'block';
  if (loginRegisterBtn) loginRegisterBtn.style.display = 'block';
  
  if (loggedInButtons) loggedInButtons.style.display = 'none';
  if (loggedInContent) loggedInContent.style.display = 'none';
  if (logoutBtn) logoutBtn.style.display = 'none';
  if (userName) userName.textContent = '';
}

// טעינת שאלונים מהשרת
function loadQuizzesFromServer() {
  const quizzesContainer = document.getElementById('quizzes');
  if (!quizzesContainer) return;

  // ניסיון לטעון מהשרת
  fetch('/api/quizzes', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('שגיאה בטעינת שאלונים מהשרת');
      }
      return response.json();
  })
  .then(quizzes => {
      console.log('שאלונים נטענו מהשרת:', quizzes);
      displayQuizzes(quizzes);
  })
  .catch(error => {
      console.log('לא ניתן לטעון שאלונים מהשרת, טוען דוגמאות:', error);
      // אם השרת לא זמין, טוען דוגמאות
      const sampleQuizzes = [
          {
              id: 1,
              title: 'טיפוסי אישיות',
              description: 'גלה את סוג האישיות שלך ומה היא אומרת עליך.',
              image: '../images/quiz1.svg',
              url: '../quizzes/tipus.html',
              time: '10 דק\''
          },
          {
              id: 2,
              title: 'חוזקות וכישורים',
              description: 'גלה מהן החוזקות והכישורים הטבעיים שלך.',
              image: '../images/quiz2.svg',
              url: '../quizzes/strengths.html',
              time: '15 דק\''
          },
          {
              id: 3,
              title: 'התאמה לקריירה',
              description: 'בדוק אילו תחומי קריירה מתאימים לך ביותר.',
              image: '../images/quiz3.svg',
              url: '../quizzes/career.html',
              time: '12 דק\''
          }
      ];
      displayQuizzes(sampleQuizzes);
  });
}

// הצגת שאלונים
function displayQuizzes(quizzes) {
  const quizzesContainer = document.getElementById('quizzes');
  if (!quizzesContainer) return;
  
  quizzesContainer.innerHTML = ''; // ניקוי תוכן קודם

  quizzes.forEach(q => {
      const card = document.createElement('article');
      card.classList.add('quiz-card');
      card.tabIndex = 0;
      card.setAttribute('role', 'link');
      card.setAttribute('aria-label', `עבור לשאלון ${q.title}`);

      card.innerHTML = `
        <div class="quiz-image" style="background-image: url('${q.image || '../images/quiz-default.svg'}'); background-size: contain; background-repeat: no-repeat; background-position: center;"></div>
        <div class="quiz-content">
          <h3>${q.title}</h3>
          <p>${q.description}</p>
          <div class="quiz-meta">
            <span>זמן משוער: ${q.time || q.duration || '15 דק\''}</span>
            <a href="${q.url || '#'}" class="btn btn-outline" aria-label="התחל את השאלון ${q.title}">התחל</a>
          </div>
        </div>
      `;

      const quizLink = card.querySelector('a');
      if (quizLink) {
        quizLink.addEventListener('click', e => {
          e.preventDefault();
          
          if (!isLoggedIn()) {
              alert('עליך להתחבר כדי לבצע שאלון');
              const loginBtn = document.getElementById('login-register-btn');
              if (loginBtn) loginBtn.click();
              return;
          }
          
          window.location.href = q.url || '../quizzes/quizzes.html';
        });
      }

      quizzesContainer.appendChild(card);
  });
}

// טעינת המלצות מהשרת
function loadTestimonialsFromServer() {
  const testimonialsContainer = document.getElementById('testimonials');
  if (!testimonialsContainer) return;

  // ניסיון לטעון מהשרת
  fetch('/api/testimonials', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('שגיאה בטעינת המלצות מהשרת');
      }
      return response.json();
  })
  .then(testimonials => {
      console.log('המלצות נטענו מהשרת:', testimonials);
      displayTestimonials(testimonials);
  })
  .catch(error => {
      console.log('לא ניתן לטעון המלצות מהשרת, טוען דוגמאות:', error);
      // אם השרת לא זמין, טוען דוגמאות
      const sampleTestimonials = [
          {
              author: "מיכל כהן",
              role: "סטודנטית",
              text: "השאלונים עזרו לי להבין את עצמי טוב יותר ולבחור את מסלול הלימודים המתאים לי."
          },
          {
              author: "אורי לוי",
              role: "מנהל משאבי אנוש",
              text: "הכלים באתר מסייעים לי להבין את העובדים שלי ולשפר את תהליכי הגיוס."
          },
          {
              author: "שרה דויד",
              role: "מאמנת אישית",
              text: "אני ממליצה לכל מי שמעוניין בהתפתחות אישית להשתמש בשאלונים כאן."
          }
      ];
      displayTestimonials(sampleTestimonials);
  });
}

// הצגת המלצות
function displayTestimonials(testimonials) {
  const testimonialsContainer = document.getElementById('testimonials');
  if (!testimonialsContainer) return;
  
  testimonialsContainer.innerHTML = ''; // ניקוי תוכן קודם

  testimonials.forEach(t => {
      const card = document.createElement('div');
      card.classList.add('testimonial-card');
      card.tabIndex = 0;

      const initials = t.author.split(' ').map(n => n[0]).join('');
      card.innerHTML = `
        <div class="testimonial-header">
          <div class="testimonial-avatar" aria-hidden="true">${initials}</div>
          <div class="testimonial-author">
            <h4>${t.author}</h4>
            <p>${t.role}</p>
          </div>
        </div>
        <div class="testimonial-text">"${t.text}"</div>
      `;

      testimonialsContainer.appendChild(card);
  });
}