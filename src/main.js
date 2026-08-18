async function loadHeader() {
  const defaultHeaderHTML = `
    <span class="logo">
      Blog<span>Lab</span>
    </span>
    <nav>
      <ul class="nav-menu">
        <li><a href="index.html">Home</a></li>
        <li><a href="category.html">Category</a></li>
        <li><a href="search_page.html">Search</a></li>
        <li><a href="Dashboard/login.html">Login</a></li>
      </ul>
    </nav>
    <img src="images/menu-bar.png" alt="" class="nav-icon">
  `;

  const isDashboard = window.location.pathname.includes("/Dashboard/");
  let htmlContent = "";

  try {
    const headerPath = isDashboard ? "../header.html" : "header.html";
    const response = await fetch(headerPath);
    if (response.ok) {
      htmlContent = await response.text();
    } else {
      htmlContent = defaultHeaderHTML;
    }
  } catch (error) {
    console.warn("Fetch failed, using local header fallback:", error);
    htmlContent = defaultHeaderHTML;
  }

  const header = document.querySelector("header");
  if (header) {
    header.innerHTML = htmlContent;
    
    // Bind correct paths relative to dashboard location
    const homeLink = header.querySelector("a[href='index.html']");
    const categoryLink = header.querySelector("a[href='category.html']");
    const searchLink = header.querySelector("a[href='search_page.html']");
    const loginLink = header.querySelector("a[href='Dashboard/login.html']");
    const navIcon = header.querySelector(".nav-icon");
    const navMenu = header.querySelector(".nav-menu");

    if (isDashboard) {
      if (homeLink) homeLink.href = "../index.html";
      if (categoryLink) categoryLink.href = "../category.html";
      if (searchLink) searchLink.href = "../search_page.html";
      if (loginLink) loginLink.href = "login.html";
      if (navIcon) navIcon.src = "../images/menu-bar.png";
    }

    if (navIcon && navMenu) {
      navIcon.addEventListener("click", () => {
        navMenu.classList.toggle("active");
      });
    }
  }
}

// ============ SUBSCRIPTION FORM LOGIC =============
function setupSubscription() {
  const subscribeButton = document.querySelector("footer .input-box button");
  const emailInput = document.querySelector("footer .input-box input");
  
  if (subscribeButton && emailInput) {
    subscribeButton.addEventListener("click", (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email || !email.includes("@")) {
        alert("Please enter a valid email address!");
        return;
      }
      alert(`Thank you for subscribing, ${email}!`);
      emailInput.value = "";
    });
  }
}

// ============ RENDER HOMEPAGE CONTENT DYNAMICALLY =============
function renderHomepage() {
  // Guard clause to only run on index.html
  if (!document.querySelector(".hero_section") || !window.DB) return;

  const posts = window.DB.getPosts().filter(p => p.status === "published" || !p.status);
  if (!posts.length) return;

  // 1. Render Featured Card (Left Box - child_one)
  const featuredContainer = document.querySelector(".news .child_one");
  if (featuredContainer && posts[0]) {
    const p = posts[0];
    featuredContainer.innerHTML = `
      <a href="post_details.html?id=${p.id}" style="text-decoration: none; color: inherit; display: block;">
        <img src="${p.image || 'https://picsum.photos/600/400?sig=1'}" alt="${p.title}">
        <div class="child_one_text">
          <h3>${p.title}</h3>
          <p>${p.summary}</p>
        </div>
      </a>
    `;
  }

  // 2. Render Sub-Posts (Left Box - child_two)
  const subContainer = document.querySelector(".news .child_two");
  if (subContainer) {
    subContainer.innerHTML = "";
    const subPosts = posts.slice(1, 5);
    subPosts.forEach((p, idx) => {
      subContainer.innerHTML += `
        <div class="card">
          <img src="${p.image || `https://picsum.photos/120/120?sig=${idx+2}`}" alt="${p.title}">
          <div class="child_two_text">
            <p><a href="post_details.html?id=${p.id}" style="text-decoration: none; color: inherit;">${p.title}</a></p>
            <span class="date">${p.author || 'Katy Liu'} on ${p.date || 'Sep 29, 2017'}</span>
          </div>
        </div>
      `;
    });
  }

  // 3. Render Trending (Left Box - news2)
  const trendingContainer = document.querySelector(".news2");
  if (trendingContainer) {
    trendingContainer.innerHTML = "";
    const trendingPosts = posts.slice(5, 7);
    trendingPosts.forEach((p, idx) => {
      trendingContainer.innerHTML += `
        <div class="child_one">
          <a href="post_details.html?id=${p.id}" style="text-decoration: none; color: inherit; display: block;">
            <img src="${p.image || `https://picsum.photos/600/400?sig=${idx+10}`}" alt="${p.title}">
            <div class="child_one_text">
              <h3>${p.title}</h3>
              <p>${p.summary}</p>
            </div>
          </a>
        </div>
      `;
    });
  }

  // 4. Render Right Sidebar Top Stories (right-box stories_container)
  const storiesContainer = document.querySelector(".stories_container");
  if (storiesContainer) {
    storiesContainer.innerHTML = "";
    const topStories = posts.slice(2, 7);
    topStories.forEach((p, idx) => {
      storiesContainer.innerHTML += `
        <div class="card">
          <img src="${p.image || `https://picsum.photos/80/80?sig=${idx+20}`}" alt="${p.title}">
          <div class="child_two_text">
            <p><a href="post_details.html?id=${p.id}" style="text-decoration: none; color: inherit;">${p.title}</a></p>
          </div>
        </div>
      `;
    });
  }

  // 5. Render Right Sidebar Today's Pick (right-box news8)
  const pickContainer = document.querySelector(".right-box .news8");
  if (pickContainer && posts[7]) {
    const p = posts[7];
    pickContainer.innerHTML = `
      <a href="post_details.html?id=${p.id}" style="text-decoration: none; color: inherit; display: block;">
        <img src="${p.image || 'https://picsum.photos/400/300?sig=8'}" alt="${p.title}">
        <h3>${p.title}</h3>
      </a>
    `;
  }

  // 6. Render Events (Grid at bottom)
  const eventContainer = document.querySelector(".event-section .container");
  if (eventContainer) {
    eventContainer.innerHTML = "";
    const eventPosts = posts.slice(0, 3);
    eventPosts.forEach((p, idx) => {
      const categories = ["Technology", "Business", "Economy"];
      const cat = p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : categories[idx];
      eventContainer.innerHTML += `
        <div class="event" style="background-image: linear-gradient(rgba(8, 12, 20, 0.7), rgba(8, 12, 20, 0.6)), url('${p.image || `https://picsum.photos/600/400?sig=${idx+50}`}')">
          <span class="event_type" onclick="window.location.href='category.html?cat=${p.category}'">${cat}</span>
          <h3><a href="post_details.html?id=${p.id}" style="text-decoration: none; color: inherit;">${p.title}</a></h3>
          <p>${p.author || 'Katy Liu'} on ${p.date || 'Sep 29, 2017'}</p>
        </div>
      `;
    });
  }
}

// Run functions on load
document.addEventListener("DOMContentLoaded", () => {
  loadHeader();
  setupSubscription();
  
  // Wait slightly to ensure DB methods are initialized
  setTimeout(renderHomepage, 50);
});
