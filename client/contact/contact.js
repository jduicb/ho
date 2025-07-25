document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const successMessage = document.getElementById("form-success");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      // כאן אפשר להוסיף שליחה אמיתית לשרת בעתיד
      form.reset();
      successMessage.hidden = false;
  
      setTimeout(() => {
        successMessage.hidden = true;
      }, 5000);
    });
  });
  