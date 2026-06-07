const barButton = document.querySelector(".show-side-bar");
const sideBar = document.querySelector(".side-bar");

barButton.addEventListener("click",  ()=>{
  sideBar.classList.toggle("active")
})