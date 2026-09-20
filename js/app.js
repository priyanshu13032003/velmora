// Velmora - Main Application Orchestrator

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Subsystems
  if (window.AuthManager) window.AuthManager.init();
  if (window.CartManager) window.CartManager.init();
  if (window.Customizer) window.Customizer.init();
  if (window.CheckoutManager) window.CheckoutManager.init();

  // Render Core Content
  renderProductsCatalog(products);
  setupCatalogFilters();
  setupProductSearch();
  setupQuickViewModal();
  setupMobileMenu();
  setupSmoothScrolling();
});

// 1. Render Products Grid
function renderProductsCatalog(itemsToRender) {
  const grid = document.getElementById("productsGrid");
  const countEl = document.getElementById("productsCountDisplay");
  if (!grid) return;

  if (countEl) countEl.textContent = `Showing ${itemsToRender.length} products`;

  if (itemsToRender.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <p class="text-neutral-500 text-lg">No products found matching your search.</p>
        <button class="mt-4 px-5 py-2 text-sm font-semibold rounded-full bg-neutral-900 text-white" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = itemsToRender.map(p => `
    <div class="group product-card bg-white rounded-2xl overflow-hidden border border-neutral-200/80 transition-all duration-300 hover:shadow-xl hover:border-neutral-300 flex flex-col" data-id="${p.id}">
      <!-- Image Container -->
      <div class="relative aspect-square w-full bg-neutral-100 overflow-hidden cursor-pointer quick-view-trigger" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}" loading="lazy" class="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500">
        
        <!-- Badges -->
        <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          ${p.badge ? `<span class="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-neutral-900 text-white shadow-sm">${p.badge}</span>` : ''}
          ${p.originalPrice > p.price ? `<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-600 text-white shadow-sm">Save ${Math.round(((p.originalPrice - p.price)/p.originalPrice)*100)}%</span>` : ''}
        </div>

        <!-- Quick View Overlay Button -->
        <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center p-4">
          <button type="button" class="w-full py-2.5 bg-white/95 backdrop-blur text-neutral-900 font-semibold text-xs rounded-xl shadow-lg hover:bg-white transition">
            Quick View
          </button>
        </div>
      </div>

      <!-- Info -->
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span>${p.categoryLabel}</span>
            <div class="flex items-center text-amber-500 font-semibold">
              <span>★ ${p.rating}</span>
              <span class="text-neutral-400 text-[10px] ml-1">(${p.reviewsCount})</span>
            </div>
          </div>
          <h3 class="font-bold text-neutral-900 text-sm leading-snug group-hover:text-neutral-700 transition line-clamp-1 cursor-pointer quick-view-trigger" data-id="${p.id}">
            ${p.name}
          </h3>
          <p class="text-neutral-500 text-xs mt-1 line-clamp-2 leading-relaxed">
            ${p.description}
          </p>
        </div>

        <div class="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <div class="flex items-baseline gap-1.5">
              <span class="font-extrabold text-neutral-900 text-base">₹${p.price.toLocaleString("en-IN")}</span>
              ${p.originalPrice ? `<span class="text-xs text-neutral-400 line-through">₹${p.originalPrice.toLocaleString("en-IN")}</span>` : ''}
            </div>
          </div>
          <button type="button" class="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold add-to-cart-direct-btn transition flex items-center gap-1.5 shadow-sm" data-id="${p.id}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            Add
          </button>
        </div>
      </div>
    </div>
  `).join("");

  // Attach trigger listeners
  grid.querySelectorAll(".quick-view-trigger").forEach(el => {
    el.addEventListener("click", () => {
      const pid = el.dataset.id;
      const prod = products.find(p => p.id === pid);
      if (prod) openQuickView(prod);
    });
  });

  grid.querySelectorAll(".add-to-cart-direct-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const pid = btn.dataset.id;
      const prod = products.find(p => p.id === pid);
      if (prod && window.CartManager) {
        window.CartManager.addItem({
          id: prod.id,
          name: prod.name,
          price: prod.price,
          image: prod.image,
          size: prod.sizes ? prod.sizes[0] : "Standard",
          color: prod.colorNames ? prod.colorNames[0] : "Default",
          quantity: 1
        });
        showToast(`Added "${prod.name}" to cart!`);
      }
    });
  });
}

// 2. Setup Category Filters
function setupCatalogFilters() {
  const tabsContainer = document.getElementById("categoryFilterTabs");
  if (!tabsContainer) return;

  tabsContainer.querySelectorAll(".category-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      tabsContainer.querySelectorAll(".category-filter-btn").forEach(b => b.classList.remove("active-category-filter"));
      btn.classList.add("active-category-filter");
      const cat = btn.dataset.category;

      if (cat === "all") {
        renderProductsCatalog(products);
      } else {
        const filtered = products.filter(p => p.category === cat);
        renderProductsCatalog(filtered);
      }
    });
  });
}

// 3. Product Search
function setupProductSearch() {
  const searchInput = document.getElementById("headerSearchInput");
  const mobileSearchInput = document.getElementById("mobileSearchInput");

  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      const activeCatBtn = document.querySelector(".active-category-filter");
      const cat = activeCatBtn ? activeCatBtn.dataset.category : "all";
      if (cat === "all") renderProductsCatalog(products);
      else renderProductsCatalog(products.filter(p => p.category === cat));
      return;
    }

    const matched = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      (p.seoKeywords && p.seoKeywords.some(k => k.toLowerCase().includes(q))) ||
      p.categoryLabel.toLowerCase().includes(q)
    );
    renderProductsCatalog(matched);
  };

  if (searchInput) searchInput.addEventListener("input", handleSearch);
  if (mobileSearchInput) mobileSearchInput.addEventListener("input", handleSearch);
}

function resetFilters() {
  const allBtn = document.querySelector('[data-category="all"]');
  if (allBtn) allBtn.click();
  const search = document.getElementById("headerSearchInput");
  if (search) search.value = "";
}

// 4. Quick View Modal
function setupQuickViewModal() {
  const modal = document.getElementById("quickViewModal");
  const closeBtn = document.getElementById("closeQuickViewBtn");
  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  }
}

function openQuickView(product) {
  const modal = document.getElementById("quickViewModal");
  if (!modal) return;

  document.getElementById("qvProductImage").src = product.image;
  document.getElementById("qvProductImage").alt = product.name;
  document.getElementById("qvProductName").textContent = product.name;
  document.getElementById("qvProductCategory").textContent = product.categoryLabel;
  document.getElementById("qvProductPrice").textContent = `₹${product.price.toLocaleString("en-IN")}`;
  
  const origPriceEl = document.getElementById("qvProductOriginalPrice");
  if (origPriceEl) {
    if (product.originalPrice) {
      origPriceEl.textContent = `₹${product.originalPrice.toLocaleString("en-IN")}`;
      origPriceEl.classList.remove("hidden");
    } else {
      origPriceEl.classList.add("hidden");
    }
  }

  document.getElementById("qvProductRating").textContent = `★ ${product.rating} (${product.reviewsCount} verified reviews)`;
  document.getElementById("qvProductDescription").textContent = product.description;

  // SEO Keywords tags
  const tagsEl = document.getElementById("qvProductKeywords");
  if (tagsEl) {
    tagsEl.innerHTML = (product.seoKeywords || []).map(k => `
      <span class="px-2 py-0.5 text-[11px] rounded bg-neutral-100 text-neutral-600">#${k}</span>
    `).join("");
  }

  // Sizes
  const sizeContainer = document.getElementById("qvSizeOptions");
  let selectedSize = product.sizes ? product.sizes[0] : "Standard";
  if (sizeContainer) {
    sizeContainer.innerHTML = (product.sizes || ["Standard"]).map(s => `
      <button type="button" class="qv-size-btn px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold ${s === selectedSize ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-50'}" data-size="${s}">${s}</button>
    `).join("");

    sizeContainer.querySelectorAll(".qv-size-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        sizeContainer.querySelectorAll(".qv-size-btn").forEach(b => {
          b.classList.remove("bg-neutral-900", "text-white");
          b.classList.add("hover:bg-neutral-50");
        });
        btn.classList.add("bg-neutral-900", "text-white");
        selectedSize = btn.dataset.size;
      });
    });
  }

  // Colors
  const colorContainer = document.getElementById("qvColorOptions");
  let selectedColor = product.colorNames ? product.colorNames[0] : "Default";
  if (colorContainer && product.colors) {
    colorContainer.innerHTML = product.colors.map((c, i) => `
      <button type="button" class="qv-color-btn w-6 h-6 rounded-full border-2 ${i === 0 ? 'border-neutral-900 scale-110' : 'border-neutral-300'}" 
        style="background-color: ${c}" data-color="${product.colorNames[i]}" title="${product.colorNames[i]}"></button>
    `).join("");

    colorContainer.querySelectorAll(".qv-color-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        colorContainer.querySelectorAll(".qv-color-btn").forEach(b => b.classList.remove("border-neutral-900", "scale-110"));
        btn.classList.add("border-neutral-900", "scale-110");
        selectedColor = btn.dataset.color;
      });
    });
  }

  // Quantity stepper
  let currentQty = 1;
  const qtyDisplay = document.getElementById("qvQtyDisplay");
  if (qtyDisplay) qtyDisplay.textContent = currentQty;

  const decBtn = document.getElementById("qvQtyDec");
  const incBtn = document.getElementById("qvQtyInc");
  if (decBtn) decBtn.onclick = () => { if (currentQty > 1) { currentQty--; qtyDisplay.textContent = currentQty; } };
  if (incBtn) incBtn.onclick = () => { currentQty++; qtyDisplay.textContent = currentQty; };

  // Add to cart from QV
  const addBtn = document.getElementById("qvAddToCartBtn");
  if (addBtn) {
    addBtn.onclick = () => {
      if (window.CartManager) {
        window.CartManager.addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: selectedSize,
          color: selectedColor,
          quantity: currentQty
        });
        modal.classList.add("hidden");
        showToast(`Added ${currentQty}× "${product.name}" to cart!`);
      }
    };
  }

  modal.classList.remove("hidden");
}

// 5. Render Blog Articles
function renderBlogSection() {
  const container = document.getElementById("blogArticlesContainer");
  if (!container || !window.blogArticles) return;

  container.innerHTML = window.blogArticles.map(art => `
    <article class="bg-white rounded-2xl overflow-hidden border border-neutral-200/80 hover:shadow-lg transition flex flex-col">
      <div class="aspect-video w-full overflow-hidden bg-neutral-100">
        <img src="${art.coverImage}" alt="${art.title}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
      </div>
      <div class="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 text-xs text-neutral-500 mb-2">
            <span class="font-semibold text-neutral-900">${art.category}</span>
            <span>•</span>
            <span>${art.readTime}</span>
            <span>•</span>
            <span>${art.date}</span>
          </div>
          <h3 class="text-base font-bold text-neutral-900 leading-snug mb-2 hover:text-neutral-700 cursor-pointer read-blog-trigger" data-slug="${art.slug}">
            ${art.title}
          </h3>
          <p class="text-neutral-600 text-xs leading-relaxed line-clamp-3 mb-4">
            ${art.excerpt}
          </p>
        </div>
        <div class="pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div class="flex flex-wrap gap-1">
            ${art.tags.slice(0, 2).map(t => `<span class="px-2 py-0.5 text-[10px] bg-neutral-100 rounded text-neutral-600">#${t}</span>`).join("")}
          </div>
          <button class="text-xs font-bold text-neutral-900 hover:underline read-blog-trigger flex items-center gap-1" data-slug="${art.slug}">
            Read Article →
          </button>
        </div>
      </div>
    </article>
  `).join("");

  // Blog full view modal
  container.querySelectorAll(".read-blog-trigger").forEach(btn => {
    btn.addEventListener("click", () => {
      const slug = btn.dataset.slug;
      const article = window.blogArticles.find(a => a.slug === slug);
      if (article) openBlogModal(article);
    });
  });
}

function openBlogModal(article) {
  const modal = document.createElement("div");
  modal.className = "fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto";
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-neutral-200 my-8 relative">
      <button class="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 text-2xl close-blog-modal">&times;</button>
      <div class="flex items-center gap-2 text-xs text-neutral-500 mb-2">
        <span class="font-bold text-neutral-900 uppercase">${article.category}</span>
        <span>•</span>
        <span>${article.date}</span>
        <span>•</span>
        <span>By ${article.author}</span>
      </div>
      <h2 class="text-2xl font-extrabold text-neutral-900 leading-tight mb-4">${article.title}</h2>
      <div class="rounded-xl overflow-hidden mb-6 max-h-72">
        <img src="${article.coverImage}" alt="${article.title}" class="w-full h-full object-cover">
      </div>
      <div class="blog-prose text-neutral-700 text-sm leading-relaxed space-y-4">
        ${article.content}
      </div>
      <div class="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between">
        <div class="flex flex-wrap gap-1.5">
          ${article.tags.map(t => `<span class="px-2.5 py-1 text-xs bg-neutral-100 rounded-full font-medium text-neutral-700">#${t}</span>`).join("")}
        </div>
        <button class="px-5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold close-blog-modal">Close Article</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelectorAll(".close-blog-modal").forEach(b => b.addEventListener("click", () => modal.remove()));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });
}

// 6. Render SEO Keywords Table
function renderSeoKeywordsTable() {
  const tbody = document.getElementById("seoKeywordsTableBody");
  if (!tbody || !window.seoKeywordsData) return;

  tbody.innerHTML = window.seoKeywordsData.map(kw => `
    <tr class="border-b border-neutral-100 hover:bg-neutral-50/70 text-xs">
      <td class="py-3 px-4 font-semibold text-neutral-900 flex items-center gap-1.5">
        <span>${kw.keyword}</span>
      </td>
      <td class="py-3 px-4 font-bold text-neutral-700">${kw.volume}</td>
      <td class="py-3 px-4">
        <span class="font-semibold text-neutral-800">${kw.kd}</span>
      </td>
      <td class="py-3 px-4 text-neutral-600">${kw.intent}</td>
      <td class="py-3 px-4">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${kw.priority === 'Quick win' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
          ${kw.priority}
        </span>
      </td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-medium">${kw.page}</span>
      </td>
    </tr>
  `).join("");
}

// 7. Mobile Menu
function setupMobileMenu() {
  const toggleBtn = document.getElementById("mobileMenuToggleBtn");
  const menu = document.getElementById("mobileMenuDrawer");
  const closeBtn = document.getElementById("closeMobileMenuBtn");

  if (toggleBtn && menu) {
    toggleBtn.addEventListener("click", () => menu.classList.toggle("hidden"));
  }
  if (closeBtn && menu) {
    closeBtn.addEventListener("click", () => menu.classList.add("hidden"));
  }
}

// 8. Smooth Scrolling
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
        // Close mobile menu if open
        const mobileMenu = document.getElementById("mobileMenuDrawer");
        if (mobileMenu) mobileMenu.classList.add("hidden");
      }
    });
  });
}
