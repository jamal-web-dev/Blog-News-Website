// ============ AUTHENTICATION LOGIC ============

const signup_link = document.querySelector(".signup_link a");
const login_link = document.querySelector(".login_link a");

const signup_section = document.querySelector(".signup_section");
const login_section = document.querySelector(".login_section");

// Form Toggling
if (signup_link && signup_section && login_section) {
  signup_link.addEventListener("click", () => {
    signup_section.style.display = "block";
    login_section.style.display = "none";
  });
}
if (login_link && signup_section && login_section) {
  login_link.addEventListener("click", () => {
    signup_section.style.display = "none";
    login_section.style.display = "block";
  });
}

// Form Handlers
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login_container");
  const signupForm = document.querySelector(".signup_container");

  // 1. Handle Login Submit
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const email = loginForm.querySelector("input[type='email']").value.trim();
      const password = loginForm.querySelector("input[type='password']").value;

      if (!email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      if (window.DB) {
        const user = window.DB.login(email, password);
        if (user) {
          alert(`Welcome back, ${user.firstName}!`);
          window.location.href = "index.html";
        } else {
          alert("Invalid email or password. Please try again.");
        }
      } else {
        alert("Database manager not found!");
      }
    });
  }

  // 2. Handle Registration Submit
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const firstName = signupForm.querySelector(".name_box input:nth-child(1)").value.trim();
      const lastName = signupForm.querySelector(".name_box input:nth-child(2)").value.trim();
      const email = signupForm.querySelector(".email_box input[type='email']").value.trim();
      const password = signupForm.querySelector(".email_box input[type='password']").value;

      if (!firstName || !lastName || !email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      const newUser = { email, password, firstName, lastName };

      if (window.DB) {
        const success = window.DB.registerUser(newUser);
        if (success) {
          alert("Registration successful! Logging you in...");
          window.DB.login(email, password); // Automatically establish session
          window.location.href = "index.html";
        } else {
          alert("This email is already registered. Please login instead.");
        }
      } else {
        alert("Database manager not found!");
      }
    });
  }
});