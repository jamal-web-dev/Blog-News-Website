const form = document.getElementById("postForm");
const categorySelect = document.getElementById("category");

// 1. Populate category dropdown dynamically from database
function populateCategories() {
  if (!window.DB || !categorySelect) return;
  
  const categories = window.DB.getCategories();
  categorySelect.innerHTML = "";
  
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.name;
    categorySelect.appendChild(opt);
  });
}

// 2. Prepopulate author with currently logged-in user
function prepopulateAuthor() {
  const authorInput = document.getElementById("author");
  if (authorInput && window.DB) {
    const user = window.DB.getCurrentUser();
    if (user) {
      authorInput.value = `${user.firstName} ${user.lastName}`;
      authorInput.disabled = true; // Protect author name
    }
  }
}

// Initialize form dependencies
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    populateCategories();
    prepopulateAuthor();
  }, 100);
});

// Helper to convert image files to base64 for localstorage persistence
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// 3. Form Submit Logic
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!window.DB) {
    alert("Database manager not found!");
    return;
  }

  const fileInput = document.getElementById("image");
  let imageSource = "";

  if (fileInput.files.length) {
    try {
      imageSource = await getBase64(fileInput.files[0]);
    } catch (err) {
      console.error("Error reading image:", err);
      imageSource = "https://picsum.photos/600/400?sig=" + Date.now();
    }
  } else {
    // Fallback to picsum matching category
    imageSource = `https://picsum.photos/600/400?sig=${Math.floor(Math.random() * 1000)}`;
  }

  const user = window.DB.getCurrentUser();
  const authorName = user ? `${user.firstName} ${user.lastName}` : (document.getElementById("author").value || "Katy Liu");

  const postData = {
    title: document.getElementById("title").value.trim(),
    category: document.getElementById("category").value,
    author: authorName,
    image: imageSource,
    content: document.getElementById("content").value.trim(),
    tags: document.getElementById("tags").value
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0),
    status: document.getElementById("status").value,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  };

  try {
    const previewBox = document.getElementById("previewBox");
    if (previewBox) {
      previewBox.innerText = "📡 Saving post to LocalStorage database...";
    }

    // Simulate API delay
    await new Promise(res => setTimeout(res, 600));

    // Save to LocalStorage DB
    window.DB.savePost(postData);

    if (previewBox) {
      previewBox.innerHTML = "✅ POST ADDED SUCCESSFULLY!<br><pre>" + JSON.stringify({
        title: postData.title,
        category: postData.category,
        author: postData.author,
        status: postData.status
      }, null, 2) + "</pre>";
    }

    alert("Post published successfully!");
    
    // Redirect to manage posts page
    window.location.href = "manage_post.html";

  } catch (err) {
    console.error("Error submitting post:", err);
    alert("An error occurred while saving the post.");
  }
});