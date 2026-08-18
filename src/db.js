/**
 * Core Storage Manager - BlogLab Database Controller
 * Provides localStorage client-side CRUD methods for posts, categories, and authentication.
 */
(function() {
  const DB_PREFIX = "bloglab_";
  
  // Default Seed Data
  const defaultCategories = [
    { id: "technology", name: "Technology", slug: "technology", description: "All things tech, AI, and innovations" },
    { id: "business", name: "Business", slug: "business", description: "Global markets, finance, and corporate strategy" },
    { id: "sports", name: "Sports", slug: "sports", description: "Athletics, updates, and training technologies" },
    { id: "fashion", name: "Fashion", slug: "fashion", description: "Trends, design, and digital craftsmanship" },
    { id: "travel", name: "Travel", slug: "travel", description: "Sustainable luxury resorts and discoveries" }
  ];

  const defaultPosts = [
    {
      id: 1,
      title: "How Did van Gogh’s Turbulent Mind Depict One of the Most Complex Concepts in Physics?",
      summary: "How Did van Gogh’s Turbulent Mind Depict One of the Most Complex Concepts in Physics...",
      content: "Vincent van Gogh’s masterpiece 'The Starry Night' is famous for its swirling brushstrokes and vibrant blue and yellow hues. However, researchers discovered a deeper hidden secret: the patterns in the painting perfectly align with Kolmogorov's mathematical theory of turbulent flows, one of the most complex concepts in classical physics. Van Gogh captured this natural phenomenon during a period of intense mental distress, demonstrating how his unique perception translated nature's chaos into art.",
      category: "technology",
      image: "images/news1.png",
      date: "Sep 29, 2017",
      author: "Katy Liu",
      tags: ["physics", "art", "van-gogh"],
      status: "published"
    },
    {
      id: 2,
      title: "The Evolution of Media and Technology Platforms",
      summary: "How modern technology platforms continue changing the landscape of journalism and digital publishing globally.",
      content: "Technology has revolutionized media consumption. From traditional print media to modern digital hubs, content distribution networks, and real-time feeds, platforms have changed how readers discover news. This article dives into the trends that are shaping tomorrow's digital publications.",
      category: "technology",
      image: "images/news2.png",
      date: "Sep 29, 2017",
      author: "Katy Liu",
      tags: ["media", "tech", "evolution"],
      status: "published"
    },
    {
      id: 3,
      title: "Global Business Trends and Market Outlook for 2026",
      summary: "Analyzing market sentiment and business optimization strategies across emerging startup sectors.",
      content: "As global markets adapt to post-inflationary conditions, business structures are changing. Startups are focusing on capital efficiency, automation, and expanding remote operations. Industry leaders share their insights into what keeps businesses growing.",
      category: "business",
      image: "images/news3.png",
      date: "Sep 29, 2017",
      author: "Katy Liu",
      tags: ["business", "global", "economy"],
      status: "published"
    },
    {
      id: 4,
      title: "Sustainable Travel and Eco-Friendly Luxury Resorts",
      summary: "Discover the rise of sustainable high-end tourism and the places combining conservation with luxury.",
      content: "Sustainable travel is no longer a niche market. Luxury resorts worldwide are adapting to conservation-first practices, utilizing solar energy, waste reduction systems, and supporting local communities, proving that high-end comfort can coexist with environmental responsibility.",
      category: "travel",
      image: "images/news4.png",
      date: "Sep 29, 2017",
      author: "Katy Liu",
      tags: ["travel", "ecology", "luxury"],
      status: "published"
    },
    {
      id: 5,
      title: "Fashion Trends: Merging Aesthetics and Digital Craftsmanship",
      summary: "A look at the latest haute couture innovations, digital tailoring, and material advancements.",
      content: "The fashion industry is embracing digital modeling and sustainable textiles. Designers are using 3D prints and biodegradable materials to present collections that challenge classical design norms while minimizing carbon footprints.",
      category: "fashion",
      image: "images/news5.png",
      date: "Sep 29, 2017",
      author: "Katy Liu",
      tags: ["fashion", "materials", "couture"],
      status: "published"
    },
    {
      id: 6,
      title: "Modern Sports Performance and Athletic Conditioning Tech",
      summary: "How wearabales, bio-sensors, and data analysis are shaping athletic training routines.",
      content: "Data analytics has transformed professional sports. From real-time heart rate tracking to predictive recovery modeling, coaches use sports technology to push the boundaries of human performance while minimizing player injuries.",
      category: "sports",
      image: "images/news6.png",
      date: "Sep 29, 2017",
      author: "Katy Liu",
      tags: ["sports", "science", "fitness"],
      status: "published"
    },
    {
      id: 7,
      title: "The Next Frontier of Economic Growth in Emerging Economies",
      summary: "A comprehensive look at digital infrastructure and fiscal policies driving growth in emerging regions.",
      content: "Emerging economies are skipping traditional industrial stages by building robust digital infrastructure. With micro-lending apps and decentralized logistics, local businesses are entering global trade markets at unprecedented rates.",
      category: "business",
      image: "images/news7.png",
      date: "Sep 29, 2017",
      author: "Katy Liu",
      tags: ["economics", "emerging", "growth"],
      status: "published"
    },
    {
      id: 8,
      title: "Understanding Cosmic Turbulence and Atmospheric Science",
      summary: "Physicists investigate how turbulence scales from fluid dynamics up to galactic spaces.",
      content: "Turbulence is all around us, from the clouds in our sky to the interstellar dust clouds in outer space. New telescope imagery helps researchers map high-velocity gas flows, uncovering the universal laws governing fluid motion on astronomical scales.",
      category: "technology",
      image: "images/news8.png",
      date: "Sep 29, 2017",
      author: "Katy Liu",
      tags: ["cosmic", "physics", "turbulence"],
      status: "published"
    }
  ];

  const defaultUsers = [
    { email: "admin@bloglab.com", password: "admin", firstName: "Admin", lastName: "User" },
    { email: "katy@bloglab.com", password: "password", firstName: "Katy", lastName: "Liu" }
  ];

  // Helper storage operations with compatibility safeguards
  let storageEnabled = true;
  const memoryStore = {};

  try {
    localStorage.setItem(DB_PREFIX + "test", "1");
    localStorage.removeItem(DB_PREFIX + "test");
  } catch (e) {
    storageEnabled = false;
    console.warn("localStorage is blocked or unsupported. Falling back to in-memory database:", e);
  }

  function get(key, defaultValue) {
    if (storageEnabled) {
      try {
        const data = localStorage.getItem(DB_PREFIX + key);
        return data ? JSON.parse(data) : defaultValue;
      } catch (e) {
        console.error("Read from localStorage failed:", e);
        return memoryStore[key] !== undefined ? memoryStore[key] : defaultValue;
      }
    } else {
      return memoryStore[key] !== undefined ? memoryStore[key] : defaultValue;
    }
  }

  function set(key, value) {
    if (storageEnabled) {
      try {
        localStorage.setItem(DB_PREFIX + key, JSON.stringify(value));
      } catch (e) {
        console.error("Write to localStorage failed:", e);
        memoryStore[key] = value;
      }
    } else {
      memoryStore[key] = value;
    }
  }

  // Initialize DB if not seeded
  function init() {
    let initialized = false;
    if (storageEnabled) {
      try {
        initialized = !!localStorage.getItem(DB_PREFIX + "initialized");
      } catch (e) {
        initialized = false;
      }
    } else {
      initialized = !!memoryStore["initialized"];
    }

    if (!initialized) {
      set("posts", defaultPosts);
      set("categories", defaultCategories);
      set("users", defaultUsers);
      
      if (storageEnabled) {
        try {
          localStorage.setItem(DB_PREFIX + "initialized", "true");
        } catch (e) {}
      } else {
        memoryStore["initialized"] = "true";
      }
      console.log("📡 Storage initialized with seed data!");
    }
  }

  init();

  // Export DB Methods Globally
  window.DB = {
    // POSTS
    getPosts: () => get("posts", []),
    getPostById: (id) => get("posts", []).find(p => p.id === parseInt(id)),
    savePost: (post) => {
      const posts = get("posts", []);
      post.id = post.id || Date.now();
      post.date = post.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      
      const index = posts.findIndex(p => p.id === post.id);
      if (index > -1) {
        posts[index] = post; // Update
      } else {
        posts.unshift(post); // Insert new at start
      }
      set("posts", posts);
      return post;
    },
    deletePost: (id) => {
      const posts = get("posts", []);
      const filtered = posts.filter(p => p.id !== parseInt(id));
      set("posts", filtered);
      return true;
    },

    // CATEGORIES
    getCategories: () => get("categories", []),
    saveCategory: (category) => {
      const categories = get("categories", []);
      category.id = category.id || category.name.toLowerCase().replace(/\s+/g, '-');
      
      const index = categories.findIndex(c => c.id === category.id);
      if (index > -1) {
        categories[index] = category;
      } else {
        categories.push(category);
      }
      set("categories", categories);
      return category;
    },
    deleteCategory: (id) => {
      const categories = get("categories", []);
      const filtered = categories.filter(c => c.id !== id);
      set("categories", filtered);
      return true;
    },

    // USERS / AUTHORS
    getUsers: () => get("users", []),
    registerUser: (user) => {
      const users = get("users", []);
      const exists = users.some(u => u.email === user.email);
      if (exists) return false;
      users.push(user);
      set("users", users);
      return true;
    },
    login: (email, password) => {
      const users = get("users", []);
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        sessionStorage.setItem(DB_PREFIX + "session", JSON.stringify(user));
        return user;
      }
      return null;
    },
    logout: () => {
      sessionStorage.removeItem(DB_PREFIX + "session");
    },
    getCurrentUser: () => {
      const session = sessionStorage.getItem(DB_PREFIX + "session");
      return session ? JSON.parse(session) : null;
    }
  };
})();
