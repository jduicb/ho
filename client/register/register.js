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

// הגדרת AJAX עם טוקן אוטומטית
$.ajaxSetup({
    beforeSend: function(xhr) {
        const token = getToken();
        if (token) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }
    }
});

// הוספת container להודעות
$(document).ready(function() {
    if (!$('#message-container').length) {
        $('.form-container').prepend('<div id="message-container"></div>');
    }
});

// פונקציות עזר
function showMessage(message, type = 'error') {
    const messageClass = type === 'success' ? 'success-message' : 'error-message';
    const bgColor = type === 'success' ? '#d4edda' : '#f8d7da';
    const textColor = type === 'success' ? '#155724' : '#721c24';
    
    $('#message-container').html(`
        <div class="${messageClass}" style="
            background-color: ${bgColor}; 
            color: ${textColor}; 
            padding: 10px; 
            border-radius: 8px; 
            margin-bottom: 15px;
            border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        ">${message}</div>
    `);
    
    setTimeout(() => {
        $('#message-container').html('');
    }, 5000);
}

function clearErrors() {
    $('.error-message').remove();
    $('input').css('border-color', '#ddd');
}

function showFieldError(fieldName, message) {
    // הסרת שגיאות קודמות
    $(`#${fieldName}`).next('.error-message').remove();
    
    // הוספת שגיאה חדשה
    $(`#${fieldName}`).after(`<div class="error-message" style="color: #721c24; font-size: 12px; margin-top: 5px;">${message}</div>`);
    $(`#${fieldName}`).css('border-color', '#db4437');
}

function setLoading(formId, isLoading) {
    const $form = $(`#${formId}`);
    const $button = $form.find('button[type="submit"]');
    
    if (isLoading) {
        $form.addClass('loading');
        $button.prop('disabled', true);
        $button.text(formId === 'login-form' ? 'מתחבר...' : 'נרשם...');
    } else {
        $form.removeClass('loading');
        $button.prop('disabled', false);
        $button.text(formId === 'login-form' ? 'התחבר' : 'הירשם');
    }
}

function handleError(xhr) {
    let errMsg = 'בעיה לא ידועה';
    if (xhr.responseJSON && xhr.responseJSON.error) {
        errMsg = xhr.responseJSON.error;
    } else if (xhr.responseJSON && xhr.responseJSON.message) {
        errMsg = xhr.responseJSON.message;
    } else if (xhr.responseText) {
        try {
            const parsed = JSON.parse(xhr.responseText);
            errMsg = parsed.error || parsed.message || errMsg;
        } catch (e) {
            errMsg = xhr.responseText;
        }
    }
    console.log('הודעת שגיאה מפורטת:', errMsg);
    showMessage('שגיאה: ' + errMsg);
}

function showLoggedInState(user) {
    showMessage('התחברת בהצלחה!', 'success');
    setTimeout(() => {
        // נווט לדף הראשי או לדף השאלונים
        window.location.href = '../index.html'; // או כל דף שתרצה
    }, 1500);
}

// וולידציה
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6; // הקטנתי ל-6 תווים
}

$(document).ready(function () {
    // בדיקה אם המשתמש מחובר כבר
    if (isLoggedIn()) {
        showMessage('אתה כבר מחובר למערכת', 'success');
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 2000);
        return;
    }

    // טיפול בטאבים
    $('#register-tab').click(function() {
        $(this).addClass('tab-active');
        $('#login-tab').removeClass('tab-active');
        $('#register-form').removeClass('hidden');
        $('#login-form').addClass('hidden');
        clearErrors();
        $('#message-container').html('');
    });

    $('#login-tab').click(function() {
        $(this).addClass('tab-active');
        $('#register-tab').removeClass('tab-active');
        $('#login-form').removeClass('hidden');
        $('#register-form').addClass('hidden');
        clearErrors();
        $('#message-container').html('');
    });

    // שליחת טופס הרשמה
    $('#register-form').submit(function (e) {
        e.preventDefault();
        clearErrors();
        
        console.log('טופס הרשמה נשלח!');

        const formData = {
            name: $('#register-name').val().trim(), // שימוש ב-name כמו בHTML
            email: $('#register-email').val().trim(),
            password: $('#register-password').val(),
            password_confirmation: $('#register-password-confirm').val(),
            terms: $('#terms').is(':checked')
        };

        console.log('נתונים שנשלחים:', formData);

        // בדיקת וולידציה
        let isValid = true;

        if (!formData.name || formData.name.length < 2) {
            showFieldError('register-name', 'אנא הכנס שם מלא (לפחות 2 תווים)');
            isValid = false;
        }

        if (!formData.email || !validateEmail(formData.email)) {
            showFieldError('register-email', 'אנא הכנס אימייל תקין');
            isValid = false;
        }

        if (!formData.password || !validatePassword(formData.password)) {
            showFieldError('register-password', 'סיסמה חייבת להכיל לפחות 6 תווים');
            isValid = false;
        }

        if (formData.password !== formData.password_confirmation) {
            showFieldError('register-password-confirm', 'הסיסמאות אינן תואמות');
            isValid = false;
        }

        if (!formData.terms) {
            showFieldError('terms', 'יש להסכים לתנאי השימוש');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        setLoading('register-form', true);

        $.ajax({
            url: 'http://localhost:5500/api/users/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                username: formData.name, // שליחה כ-username לשרת
                email: formData.email,
                password: formData.password
            }),
            beforeSend: function() {
                console.log('AJAX בקשה נשלחת...');
            },
            success: function (res) {
                console.log('תגובה מהשרת:', res);
                showMessage('נרשמת בהצלחה! כעת ניתן להתחבר.', 'success');
                $('#register-form')[0].reset();
                
                // מעבר לטאב התחברות
                setTimeout(() => {
                    $('#login-tab').click();
                }, 2000);
                
                // אם השרת מחזיר טוקן גם ברישום
                if (res.token) {
                    saveToken(res.token);
                    showLoggedInState(res.user);
                }
            },
            error: function (xhr, status, error) {
                console.log('שגיאה בAJAX:', xhr, status, error);
                console.log('תגובת השרת:', xhr.responseText);
                handleError(xhr);
            },
            complete: function() {
                setLoading('register-form', false);
            }
        });
    });

    // שליחת טופס התחברות
    $('#login-form').submit(function (e) {
        e.preventDefault();
        clearErrors();
        
        console.log('טופס התחברות נשלח!');

        const formData = {
            email: $('#login-email').val().trim(),
            password: $('#login-password').val(),
            remember: $('#remember-me').is(':checked')
        };

        console.log('נתוני התחברות:', formData);

        // וולידציה
        let isValid = true;

        if (!formData.email || !validateEmail(formData.email)) {
            showFieldError('login-email', 'אנא הכנס אימייל תקין');
            isValid = false;
        }

        if (!formData.password) {
            showFieldError('login-password', 'אנא הכנס סיסמה');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        setLoading('login-form', true);

        $.ajax({
            url: 'http://localhost:5500/api/users/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                email: formData.email,
                password: formData.password
            }),
            beforeSend: function() {
                console.log('שולח בקשת התחברות...');
            },
            success: function (res) {
                console.log('התחברות הצליחה:', res);
                $('#login-form')[0].reset();
                
                // שמירת הטוקן
                if (res.token) {
                    saveToken(res.token);
                    showLoggedInState(res.user);
                } else {
                    showMessage('שגיאה: לא התקבל טוקן מהשרת');
                }
            },
            error: function (xhr, status, error) {
                console.log('שגיאה בהתחברות:', xhr, status, error);
                handleError(xhr);
            },
            complete: function() {
                setLoading('login-form', false);
            }
        });
    });

    // טיפול בכפתורי רשתות חברתיות
    $('.google').click(function() {
        showMessage('התחברות עם Google תהיה זמינה בקרוב');
    });

    $('.facebook').click(function() {
        showMessage('התחברות עם Facebook תהיה זמינה בקרוב');
    });

    // וולידציה בסיסית לכל כפתור "שלח" בטפסים
    $('button[type="submit"]').on('click', function (e) {
        const form = $(this).closest('form');
        const requiredInputs = form.find('input[required]');
        let valid = true;

        requiredInputs.each(function () {
            if (!$(this).val()) {
                $(this).css('border-color', '#db4437');
                valid = false;
            } else {
                $(this).css('border-color', '#ddd');
            }
        });

        if (!valid) {
            e.preventDefault();
        }
    });
});