let posts = [];

const grid =
document.getElementById("posts");

const title =
document.getElementById("pageTitle");




async function loadPosts(){

skeleton();

try{

const response =
await fetch("news.json");

posts =
await response.json();

render("all");

}

catch(error){

grid.innerHTML = `

<h2>
Unable to load news
</h2>

`;

console.log(error);

}

}


/* LOADING SKELETON */

function skeleton(){

grid.innerHTML = "";

for(let i=0;i<6;i++){

grid.innerHTML +=
`<div class="skeleton"></div>`;

}

}


/* RENDER POSTS */

function render(cat){

skeleton();

setTimeout(()=>{

grid.innerHTML = "";

const filtered =

cat === "all"

? posts

: posts.filter(
p =>
p.category === cat
);


filtered.forEach(post=>{

grid.innerHTML += `

<div class="card">

<img
src="${
post.image ||
"https://picsum.photos/600/400"
}"
alt="${post.title}"
>

<div class="card-body">

<div class="date">
${post.date}
</div>

<div class="title">
${post.title}
</div>

<div class="summary">
${post.summary}
</div>

</div>

</div>

`;

});

},500);

}


/* CATEGORY FILTER */

document
.querySelectorAll(".category")

.forEach(btn=>{

btn.onclick = ()=>{

document
.querySelector(".category.active")
?.classList
.remove("active");

btn.classList.add("active");

const cat =
btn.dataset.category;

title.textContent =

cat === "all"

? "All News"

:

cat.charAt(0)
.toUpperCase()

+

cat.slice(1);

render(cat);

};

});




document
.getElementById("menuBtn")

.onclick = ()=>{

document
.getElementById("sidebar")

.classList
.toggle("open");

};




loadPosts();