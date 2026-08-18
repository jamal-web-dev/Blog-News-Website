// ============ MANAGEMENT ACTIONS LOGIC (POSTS & CATEGORIES) =====

document.addEventListener("DOMContentLoaded", () => {
  if (!window.DB) return;

  const isCategoryPage = window.location.pathname.includes("manage_category.html");
  const isPostPage = window.location.pathname.includes("manage_post.html");

  const listContainer = document.querySelector(".post-activity");
  if (!listContainer) return;

  // 1. Render Manage Categories List
  function renderCategories() {
    const categories = window.DB.getCategories();
    listContainer.innerHTML = "";

    if (categories.length === 0) {
      listContainer.innerHTML = "<li>No categories found in storage.</li>";
      return;
    }

    categories.forEach(cat => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${cat.name} (${cat.slug})</span>
        <div class="manage-box">
          <span class="edit" data-id="${cat.id}">Edit</span>
          <span class="delete" data-id="${cat.id}">Delete</span>
        </div>
      `;
      listContainer.appendChild(li);
    });

    bindCategoryEvents();
  }

  function bindCategoryEvents() {
    // Handle Delete Category
    listContainer.querySelectorAll(".delete").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        if (confirm(`Are you sure you want to delete the category "${id}"?`)) {
          window.DB.deleteCategory(id);
          renderCategories();
        }
      });
    });

    // Handle Edit Category
    listContainer.querySelectorAll(".edit").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const categories = window.DB.getCategories();
        const cat = categories.find(c => c.id === id);
        if (!cat) return;

        const newName = prompt("Edit Category Name:", cat.name);
        if (newName && newName.trim()) {
          cat.name = newName.trim();
          cat.slug = newName.trim().toLowerCase().replace(/\s+/g, '-');
          window.DB.saveCategory(cat);
          renderCategories();
        }
      });
    });
  }

  // 2. Render Manage Posts List
  function renderPosts() {
    const posts = window.DB.getPosts();
    listContainer.innerHTML = "";

    if (posts.length === 0) {
      listContainer.innerHTML = "<li>No articles found in storage.</li>";
      return;
    }

    posts.forEach(p => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span style="max-width: 70%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          <strong>[${p.category.toUpperCase()}]</strong> ${p.title}
        </span>
        <div class="manage-box">
          <span class="edit" data-id="${p.id}">Edit</span>
          <span class="delete" data-id="${p.id}">Delete</span>
        </div>
      `;
      listContainer.appendChild(li);
    });

    bindPostEvents();
  }

  function bindPostEvents() {
    // Handle Delete Post
    listContainer.querySelectorAll(".delete").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const post = window.DB.getPostById(id);
        if (!post) return;

        if (confirm(`Are you sure you want to delete the article "${post.title}"?`)) {
          window.DB.deletePost(id);
          renderPosts();
        }
      });
    });

    // Handle Edit Post
    listContainer.querySelectorAll(".edit").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const post = window.DB.getPostById(id);
        if (!post) return;

        const newTitle = prompt("Edit Post Title:", post.title);
        if (newTitle === null) return; // Cancel clicked
        
        if (newTitle.trim()) {
          post.title = newTitle.trim();
        }

        const newContent = prompt("Edit Post Content (use \\n for line breaks):", post.content);
        if (newContent !== null) {
          post.content = newContent.trim();
          post.summary = newContent.trim().substring(0, 100) + "...";
        }

        window.DB.savePost(post);
        renderPosts();
        alert("Post updated successfully!");
      });
    });
  }

  // Initial dispatcher
  if (isCategoryPage) {
    renderCategories();
  } else if (isPostPage) {
    renderPosts();
  }
});
