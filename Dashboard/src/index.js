// ============ DASHBOARD CORE MANAGER =====

document.addEventListener("DOMContentLoaded", () => {
  // 1. Session & Auth Check
  if (window.DB) {
    const currentUser = window.DB.getCurrentUser();
    const isLoginPage = window.location.pathname.includes("login.html");
    
    if (!currentUser && !isLoginPage) {
      // Force redirect to login if not authenticated
      window.location.href = "login.html";
      return;
    }
  }

  // 2. Sidebar Toggle Trigger
  const barButton = document.querySelector(".show-side-bar");
  const sideBar = document.querySelector(".side-bar");

  if (barButton && sideBar) {
    barButton.addEventListener("click", () => {
      sideBar.classList.toggle("active");
    });
  }

  // 3. Dynamic Stats Binding (Only on Dashboard Home - index.html)
  const isDashboardHome = document.querySelector(".overview_container");
  if (isDashboardHome && window.DB) {
    const posts = window.DB.getPosts();
    const categories = window.DB.getCategories();
    const users = window.DB.getUsers();

    // Bind Overview boxes
    const totalPostsEl = document.querySelector(".total_post p");
    const totalCatEl = document.querySelector(".total_category p");
    const totalAuthorEl = document.querySelector(".total_author p");

    if (totalPostsEl) totalPostsEl.textContent = `${posts.length} Posts`;
    if (totalCatEl) totalCatEl.textContent = `${categories.length} Categories`;
    if (totalAuthorEl) totalAuthorEl.textContent = `${users.length} Authors`;

    // Bind Recent Activities
    const postActivityEl = document.querySelector(".post-activity");
    const categoryActivityEl = document.querySelector(".category-activity");
    const authorActivityEl = document.querySelector(".author-activity");

    if (postActivityEl) {
      postActivityEl.innerHTML = "";
      const recentPosts = posts.slice(0, 3);
      if (recentPosts.length === 0) {
        postActivityEl.innerHTML = "<li>No recent posts found.</li>";
      } else {
        recentPosts.forEach(p => {
          postActivityEl.innerHTML += `<li>Post added: "${p.title}"</li>`;
        });
      }
    }

    if (categoryActivityEl) {
      categoryActivityEl.innerHTML = "";
      const recentCats = categories.slice(0, 3);
      if (recentCats.length === 0) {
        categoryActivityEl.innerHTML = "<li>No categories found.</li>";
      } else {
        recentCats.forEach(c => {
          categoryActivityEl.innerHTML += `<li>Category created: "${c.name}"</li>`;
        });
      }
    }

    if (authorActivityEl) {
      authorActivityEl.innerHTML = "";
      const recentUsers = users.slice(0, 3);
      recentUsers.forEach(u => {
        authorActivityEl.innerHTML += `<li>Author joined: ${u.firstName} ${u.lastName} (${u.email})</li>`;
      });
    }
  }

  // 4. Sign Out trigger
  const signOutLink = document.querySelector(".header a[href='login.html']");
  if (signOutLink) {
    signOutLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.DB) {
        window.DB.logout();
      }
      window.location.href = "login.html";
    });
  }
});