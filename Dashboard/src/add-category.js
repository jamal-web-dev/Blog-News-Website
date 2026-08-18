const categoryForm = document.getElementById("categoryForm");

categoryForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("categoryName").value.trim();
  const slug = document.getElementById("categorySlug").value.trim();
  const description = document.getElementById("categoryDescription").value.trim();

  if (!window.DB) {
    alert("Database manager not found!");
    return;
  }

  const newCategory = {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    slug,
    description
  };

  window.DB.saveCategory(newCategory);
  console.log("New Category Added to Storage:", newCategory);

  // Clear form
  categoryForm.reset();

  alert("Category added successfully!");
  
  // Redirect to manage categories page
  window.location.href = "manage_category.html";
});