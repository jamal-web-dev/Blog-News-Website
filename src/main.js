
// ============ DYNAMIC HEADER=====

async function loadHeader() {
  try {
    const response = await fetch("../header.html");
    const data = await response.text();
    const header = document.querySelector("header");
    header.innerHTML = data;

    const navIcon = document.querySelector(".nav-icon");
    const navMenu = document.querySelector(".nav-menu");

    navIcon.addEventListener("click", ()=>{
      navMenu.classList.toggle("active");
    })
  }catch (error) {
    console.log(error)
  }
}
loadHeader();
