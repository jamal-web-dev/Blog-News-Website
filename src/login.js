const signup_link = document.querySelector(".signup_link a");
const login_link = document.querySelector(".login_link a");

const signup_section =  document.querySelector(".signup_section");
const login_section =  document.querySelector(".login_section");

signup_link.addEventListener("click", ()=>{
  signup_section.style.display = "block";
  login_section.style.display = "none";
});
login_link.addEventListener("click", ()=>{
  signup_section.style.display = "none";
  login_section.style.display = "block";
});