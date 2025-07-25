/********************************************************************
 * ajax.js – ניהול הרשמה / התחברות / פרופיל + UI
 ********************************************************************/

/*-----------  ניהול JWT בל-localStorage  -----------*/
function saveToken(token)   { localStorage.setItem('authToken', token); }
function getToken()         { return localStorage.getItem('authToken'); }
function removeToken()      { localStorage.removeItem('authToken'); }
function isLoggedIn()       { return getToken() !== null; }

/*-----------  הזרקת הטוקן לכל קריאת AJAX  -----------*/
$.ajaxSetup({
  beforeSend: function (xhr) {
    const token = getToken();
    if (token) xhr.setRequestHeader('Authorization', 'Bearer ' + token);
  }
});

/*-----------  אימות הטוקן מול השרת (GET /verify)  -----------*/
async function verifyToken() {
  if (!isLoggedIn()) return false;           // אין טוקן כלל
  try {
    const res = await $.ajax({ url: '/api/users/verify', method: 'GET' });
    return res.user;                         // ← אובייקט user אם הכול תקין
  } catch (err) {
    removeToken();                           // טוקן לא תקף / פג תוקף
    return false;
  }
}

/*===========  טעינת הדף – קובע מצב UI ראשוני  ===========*/
$(document).ready(async function () {

  /*--- בדיקה אסינכרונית אם הטוקן עדיין תקף ---*/
  const user = await verifyToken();
  if (user) {
    showLoggedInState(user);                 // מציג שם משתמש
  } else {
    showLoggedOutState();
  }

  /*-----------  פתיחת וסגירת מודאלים  -----------*/
  $('#login-register-btn').click(() => $('#login-register-modal').attr('aria-hidden', 'false'));
  $('#admin-login-btn').click(() => $('#admin-modal').attr('aria-hidden', 'false'));
  $('.close-modal').click(function () { $(this).closest('.modal').attr('aria-hidden', 'true'); });
  $('.modal').click(function (e) { if (e.target === this) $(this).attr('aria-hidden', 'true'); });

  /*-----------  החלפת טאבים במודאל הרשמה/התחברות  -----------*/
  $('.tab-btn').click(function () {
    const tabName = $(this).data('tab');
    $('.tab-btn').removeClass('active');
    $('.tab-content').removeClass('active');
    $(this).addClass('active');
    $('#' + tabName + '-form').addClass('active');
    $('#login-register-modal-title').text(tabName === 'login' ? 'התחברות' : 'הרשמה');
  });

  /*-----------  טופס הרשמה -----------*/
  $('#register-form').submit(function (e) {
    e.preventDefault();

    const formData = {
      username: $('#register-name').val(),
      email:    $('#register-email').val(),
      password: $('#register-password').val(),
      password_confirmation: $('#register-password-confirm').val(),
      terms: $('#terms').is(':checked')
    };

    /* ולידציה */
    if (!formData.terms)                     { alert('יש להסכים לתנאי השימוש'); return; }
    if (formData.password !== formData.password_confirmation) {
      alert('הסיסמאות אינן תואמות'); return;
    }
    if (!formData.username || !formData.email || !formData.password) {
      alert('אנא מלא/י את כל השדות'); return;
    }

    $.ajax({
      url: '/api/users/register',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success: function (res) {
        alert('נרשמת בהצלחה!');
        $('#register-form')[0].reset();
        $('#login-register-modal').attr('aria-hidden', 'true');
        if (res.token) {
          saveToken(res.token);
          showLoggedInState(res.user);
        }
      },
      error: handleError
    });
  });

  /*-----------  טופס התחברות -----------*/
  $('#login-form').submit(function (e) {
    e.preventDefault();

    const formData = {
      email:    $('#login-email').val(),
      password: $('#login-password').val()
    };

    if (!formData.email || !formData.password) {
      alert('אנא מלא/י את כל השדות'); return;
    }

    $.ajax({
      url: '/api/users/login',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success: function (res) {
        alert('התחברת בהצלחה!');
        $('#login-form')[0].reset();
        $('#login-register-modal').attr('aria-hidden', 'true');
        saveToken(res.token);
        showLoggedInState(res.user);
      },
      error: handleError
    });
  });

  /*-----------  התנתקות -----------*/
  $('#logout-btn').click(function () {
    removeToken();
    showLoggedOutState();
    alert('התנתקת בהצלחה!');
  });

  /*-----------  פרופיל -----------*/
  $('#get-profile-btn, #my-profile-btn').click(function () {
    $.ajax({
      url: '/api/users/profile',
      method: 'GET',
      success: function (res) {
        alert('שם: ' + res.username + '\nאימייל: ' + res.email);
      },
      error: function (xhr) {
        if (xhr.status === 401 || xhr.status === 403) {
          removeToken();
          showLoggedOutState();
          alert('ההפעלה פגה תוקף – התחבר/י מחדש');
        } else {
          handleError(xhr);
        }
      }
    });
  });

  /*-----------  צפה בתוצאות / התחל שאלון  -----------*/
  $('#view-results-btn').click(function () {
    if (!isLoggedIn()) {
      alert('עליך להתחבר כדי לצפות בתוצאות');
      $('#login-register-btn').click();
      return;
    }
    alert('ניווט לדף תוצאות (להשלמה)');
  });

  $('#start-quiz-btn').click(function () {
    if (!isLoggedIn()) {
      alert('עליך להתחבר כדי לבצע שאלון');
      $('#login-register-btn').click();
      return;
    }
    alert('ניווט לשאלון (להשלמה)');
  });

  /*-----------  כניסת מנהל (דוגמה מקומית)  -----------*/
  $('#admin-login-form').submit(function (e) {
    e.preventDefault();
    const username = $('#admin-username').val();
    const password = $('#admin-password').val();
    if (username === 'admin' && password === 'admin123') {
      alert('כניסת מנהל בוצעה בהצלחה');
      $('#admin-modal').attr('aria-hidden', 'true');
    } else {
      alert('שם משתמש או סיסמה שגויים');
    }
  });

  /*-----------  ולידציה בסיסית לשדות חובה  -----------*/
  $('button[type="submit"]').on('click', function (e) {
    const form   = $(this).closest('form');
    const needed = form.find('input[required]');
    let ok = true;
    needed.each(function () {
      if (!$(this).val()) { $(this).css('border-color', '#db4437'); ok = false; }
      else                { $(this).css('border-color', '#ddd');   }
    });
    if (!ok) e.preventDefault();
  });

  /*-----------  תוכן דינמי (דוגמה)  -----------*/
  loadQuizzes();
  loadTestimonials();
});

/*================  פונקציות עזר  ================*/
function handleError(xhr) {
  let msg = xhr.responseJSON?.error || xhr.responseJSON?.message || xhr.responseText || 'שגיאה לא ידועה';
  alert('שגיאה: ' + msg);
}
function showLoggedInState(user) {
  $('#logged-out-buttons').hide();
  $('#logged-in-buttons, #logged-in-content').show();
  if (user?.username || user?.name) {
    $('#user-name').text('שלום, ' + (user.username || user.name));
  }
}
function showLoggedOutState() {
  $('#logged-out-buttons').show();
  $('#logged-in-buttons, #logged-in-content').hide();
}

/*-----------  טעינת שאלונים + המלצות (דוגמאות סטטיות)  -----------*/
/* … פונקציות loadQuizzes ו-loadTestimonials כבקובץ המקורי … */
