const categoryForm = document.getElementById("categoryForm");

categoryForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("categoryName").value.trim();
  const slug = document.getElementById("categorySlug").value.trim();
  const description = document.getElementById("categoryDescription").value.trim();

  const newCategory = {
    id: Date.now(),
    name,
    slug,
    description
  };

  console.log("New Category Added:", newCategory);

  // clear form
  categoryForm.reset();

  alert("Category added successfully!");
});