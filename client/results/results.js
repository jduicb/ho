document.addEventListener("DOMContentLoaded", () => {
    const resultsContainer = document.getElementById('results-container');
    const resultData = sessionStorage.getItem('quizResults');

    if (resultData) {
        const results = JSON.parse(resultData);
        resultsContainer.innerHTML = `
            <h3>התוצאה הכוללת שלך: ${results.score} נקודות</h3>
            <p>סיימת את השאלון בזמן של ${results.time} דקות.</p>
        `;
    } else {
        resultsContainer.innerHTML = `
            <h3>לא נמצאו תוצאות</h3>
            <p>אנא מלא שאלון על מנת לראות את התוצאה כאן.</p>
        `;
    }
});

function navigateHome() {
    window.location.href = "../home/home.html";
}
