const form = document.getElementById("postForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("image");
  const imageName = fileInput.files.length ? fileInput.files[0].name : null;

  const postData = {
    title: document.getElementById("title").value,
    category: document.getElementById("category").value,
    author: document.getElementById("author").value,
    image: imageName,
    content: document.getElementById("content").value,
    tags: document.getElementById("tags").value
      .split(",")
      .map(tag => tag.trim()),
    status: document.getElementById("status").value,
    createdAt: new Date().toISOString()
  };

  try {
    console.log("📡 Sending post to API...");
    console.log("POST DATA:", postData);

    await new Promise(res => setTimeout(res, 1000));

    document.getElementById("previewBox").innerText =
      "✅ POST ADDED!";

  } catch (err) {
    console.error("Error submitting post:", err);
  }
});