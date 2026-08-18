// ============ CATEGORIES FEED & FILTERING LOGIC =====

let posts = [];
let activeCat = "all";

const grid = document.getElementById("posts");
const title = document.getElementById("pageTitle");
const categoryListContainer = document.querySelector(".category-list");

// Load categories dynamically from localStorage
function renderCategoryButtons() {
  if (!window.DB || !categoryListContainer) return;
  
  const categories = window.DB.getCategories();
  
  // Clear list but keep "All" button
  categoryListContainer.innerHTML = `
    <button class="category ${activeCat === 'all' ? 'active' : ''}" data-category="all">
      All
    </button>
  `;

  categories.forEach(cat => {
    categoryListContainer.innerHTML += `
      <button class="category ${activeCat === cat.id ? 'active' : ''}" data-category="${cat.id}">
        ${cat.name}
      </button>
    `;
  });

  // Re-bind click event listeners to new buttons
  document.querySelectorAll(".category").forEach(btn => {
    btn.onclick = () => {
      document.querySelector(".category.active")?.classList.remove("active");
      btn.classList.add("active");
      
      const cat = btn.dataset.category;
      activeCat = cat;

      title.textContent = cat === "all" 
        ? "All News" 
        : cat.charAt(0).toUpperCase() + cat.slice(1);

      render(cat);
      
      // Auto close sidebar on mobile when filter is selected
      document.getElementById("sidebar")?.classList.remove("open");
    };
  });
}

// Render skeleton loading blocks
function skeleton() {
  if (!grid) return;
  grid.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    grid.innerHTML += `<div class="skeleton"></div>`;
  }
}

// Render posts matching current category
function render(cat) {
  skeleton();

  setTimeout(() => {
    if (!grid) return;
    grid.innerHTML = "";

    const filtered = cat === "all"
      ? posts
      : posts.filter(p => p.category === cat);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding-block: 40px; color: var(--text-muted);">
          <h3>No articles found in this category.</h3>
        </div>
      `;
      return;
    }

    filtered.forEach(post => {
      const summaryText = post.summary || (post.content ? post.content.substring(0, 100) + "..." : "");
      grid.innerHTML += `
        <div class="card">
          <a href="post_details.html?id=${post.id}" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%;">
            <img src="${post.image || 'https://picsum.photos/600/400'}" alt="${post.title}">
            <div class="card-body">
              <div class="date">${post.date || 'Sep 29, 2017'}</div>
              <div class="title">${post.title}</div>
              <div class="summary">${summaryText}</div>
            </div>
          </a>
        </div>
      `;
    });
  }, 400);
}

// Main initial load
async function loadPosts() {
  skeleton();
  try {
    if (window.DB) {
      // Load all published posts from localStorage
      posts = window.DB.getPosts().filter(p => p.status === "published" || !p.status);
      
      // Check query parameter for initial category selection
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('cat');
      if (catParam) {
        activeCat = catParam;
        title.textContent = activeCat.charAt(0).toUpperCase() + activeCat.slice(1);
      }

      renderCategoryButtons();
      render(activeCat);
    }
  } catch (error) {
    if (grid) {
      grid.innerHTML = `<h2>Unable to load news</h2>`;
    }
    console.error(error);
  }
}

// Mobile sidebar toggle trigger
const menuBtn = document.getElementById("menuBtn");
if (menuBtn) {
  menuBtn.onclick = () => {
    document.getElementById("sidebar")?.classList.toggle("open");
  };
}

// Run loading process on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(loadPosts, 50);
});