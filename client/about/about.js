document.addEventListener('DOMContentLoaded', () => {
    console.log("דף האודות נטען בהצלחה!");

    // הוספת ניווט דינאמי בין הדפים
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const targetPage = this.getAttribute("href");

            // סימולציה של ניווט
            console.log(`מנווט ל: ${targetPage}`);
            window.location.href = targetPage;
        });
    });

    // דוגמא לאנימציה דינמית ב-JS
    const teamMembers = document.querySelectorAll(".team-member");

    teamMembers.forEach(member => {
        member.addEventListener("mouseover", function() {
            member.style.backgroundColor = "#f0f8ff";
        });
        member.addEventListener("mouseout", function() {
            member.style.backgroundColor = "white";
        });
    });
});
