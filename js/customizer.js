// Velmora - Interactive "Create Your Own Design" Studio
// Supports: Apparel selector (T-Shirts, Hoodies, Jackets, Bags, Cases, Planners),
// Base color swatches, Multilingual text engine (any language, font, size, color, rotation),
// Image upload & sticker library, Nudge/Pan controls (up, down, left, right, center),
// Scale and rotation sliders, and STRICT GARMENT BOUNDARY CLIPPING (overflow-hidden printable area).

const GarmentTypes = {
  "t-shirt-oversized": {
    name: "Oversized Streetwear T-Shirt",
    basePrice: 899,
    category: "T-Shirts",
    mockupType: "tshirt",
    printBox: { top: "24%", left: "28%", width: "44%", height: "48%", borderRadius: "6px" },
    sizes: ["S", "M", "L", "XL", "XXL"],
    defaultColor: "#f5f2eb"
  },
  "t-shirt-classic": {
    name: "Classic Crewneck T-Shirt",
    basePrice: 699,
    category: "T-Shirts",
    mockupType: "tshirt-crew",
    printBox: { top: "25%", left: "30%", width: "40%", height: "46%", borderRadius: "4px" },
    sizes: ["XS", "S", "M", "L", "XL"],
    defaultColor: "#ffffff"
  },
  "hoodie": {
    name: "Heavyweight Streetwear Hoodie",
    basePrice: 1799,
    category: "Hoodies",
    mockupType: "hoodie",
    printBox: { top: "32%", left: "28%", width: "44%", height: "38%", borderRadius: "8px" },
    sizes: ["S", "M", "L", "XL", "XXL"],
    defaultColor: "#1a1a1a"
  },
  "jacket": {
    name: "Urban Streetwear Bomber Jacket",
    basePrice: 2499,
    category: "Jackets",
    mockupType: "jacket",
    printBox: { top: "28%", left: "27%", width: "46%", height: "44%", borderRadius: "8px" },
    sizes: ["M", "L", "XL", "XXL"],
    defaultColor: "#262b32"
  },
  "tote": {
    name: "Heavy Cotton Canvas Tote Bag",
    basePrice: 649,
    category: "Bags & Totes",
    mockupType: "tote",
    printBox: { top: "36%", left: "24%", width: "52%", height: "46%", borderRadius: "4px" },
    sizes: ["Standard (15x16 in)"],
    defaultColor: "#ece6d8"
  },
  "phone-case": {
    name: "Aesthetic Protective Phone Case",
    basePrice: 499,
    category: "Phone Cases",
    mockupType: "phone-case",
    printBox: { top: "18%", left: "14%", width: "72%", height: "66%", borderRadius: "22px" },
    sizes: ["iPhone 13/14/15/16 Pro", "Samsung S24 Ultra", "OnePlus 12"],
    defaultColor: "#ffffff"
  },
  "journal": {
    name: "Hardbound Aesthetic Journal / Desk Pad",
    basePrice: 599,
    category: "Stationery",
    mockupType: "journal",
    printBox: { top: "20%", left: "20%", width: "60%", height: "60%", borderRadius: "6px" },
    sizes: ["A5 Hardbound", "A4 Desk Pad"],
    defaultColor: "#3a3835"
  }
};

const CustomizerState = {
  garmentId: "t-shirt-oversized",
  garmentColor: "#f5f2eb",
  garmentColorName: "Vintage Cream",
  size: "L",
  // Text element state
  text: "VELMORA",
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 26,
  textColor: "#18181b",
  textAlign: "center",
  textRotation: 0,
  isBold: true,
  textPosition: { x: 0, y: -40 },
  // Image element state
  imageSrc: null,
  imagePosition: { x: 0, y: 30 },
  imageScale: 80, // percentage 10 - 200
  imageRotation: 0, // 0 - 360
  // Display settings
  showPrintGuides: true
};

// Preset Graphic Stickers for quick custom design
const PresetStickers = [
  { name: "VELMORA Wordmark", icon: "✨", url: "assets/velmora_logo.png" },
  { name: "V Brand Mark", icon: "⚡", url: "assets/velmora_v_icon.png" },
  { name: "Retro Sun", icon: "☀️", svg: `<svg viewBox="0 0 100 100" fill="#f59e0b"><circle cx="50" cy="50" r="28"/><g stroke="#f59e0b" stroke-width="4" stroke-linecap="round"><line x1="50" y1="8" x2="50" y2="16"/><line x1="50" y1="84" x2="50" y2="92"/><line x1="8" y1="50" x2="16" y2="50"/><line x1="84" y1="50" x2="92" y2="50"/><line x1="20" y1="20" x2="26" y2="26"/><line x1="74" y1="74" x2="80" y2="80"/><line x1="20" y1="80" x2="26" y2="74"/><line x1="74" y1="26" x2="80" y2="20"/></g></svg>` },
  { name: "Wild Heart", icon: "🖤", svg: `<svg viewBox="0 0 100 100" fill="#dc2626"><path d="M50,85 C20,60 10,40 10,25 C10,12 22,6 34,6 C42,6 47,11 50,15 C53,11 58,6 66,6 C78,6 90,12 90,25 C90,40 80,60 50,85 Z"/></svg>` },
  { name: "Street Star", icon: "⭐", svg: `<svg viewBox="0 0 100 100" fill="#18181b"><polygon points="50,5 64,36 98,39 72,61 80,95 50,77 20,95 28,61 2,39 36,36"/></svg>` },
  { name: "Y2K Butterfly", icon: "🦋", svg: `<svg viewBox="0 0 100 100" fill="#9333ea"><path d="M50,45 C40,20 15,20 20,45 C25,70 45,75 50,55 C55,75 75,70 80,45 C85,20 60,20 50,45 Z"/></svg>` }
];

function initCustomizer() {
  const garmentSelect = document.getElementById("customizerGarmentSelect");
  if (garmentSelect) {
    garmentSelect.innerHTML = Object.entries(GarmentTypes).map(([id, g]) => `
      <option value="${id}">${g.name} (₹${g.basePrice})</option>
    `).join("");
    garmentSelect.value = CustomizerState.garmentId;
    garmentSelect.addEventListener("change", (e) => {
      setGarmentType(e.target.value);
    });
  }

  // Setup color swatches
  setupColorSwatches();

  // Setup size selectors
  updateSizeButtons();

  // Setup Text listeners
  setupTextListeners();

  // Setup Image adjustment controls (sliders + nudge buttons)
  setupImageControls();

  // Setup Preset sticker buttons
  setupPresetStickers();

  // Setup Add To Cart button
  const addToCartBtn = document.getElementById("customizerAddToCartBtn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", addCustomDesignToCart);
  }

  // Initial render
  renderCustomizerPreview();
}

function setGarmentType(typeKey) {
  if (!GarmentTypes[typeKey]) return;
  CustomizerState.garmentId = typeKey;
  const garment = GarmentTypes[typeKey];
  CustomizerState.garmentColor = garment.defaultColor;
  CustomizerState.size = garment.sizes[0];
  updateSizeButtons();
  updatePriceDisplay();
  renderCustomizerPreview();
}

function setupColorSwatches() {
  const container = document.getElementById("garmentColorSwatches");
  if (!container) return;

  const colorPalette = [
    { name: "Vintage Cream", hex: "#f5f2eb" },
    { name: "Jet Black", hex: "#171717" },
    { name: "Optic White", hex: "#ffffff" },
    { name: "Sage Green", hex: "#879883" },
    { name: "Heather Grey", hex: "#c4c5c7" },
    { name: "Midnight Navy", hex: "#1e293b" },
    { name: "Dusty Rose", hex: "#e5b7b7" },
    { name: "Mocha", hex: "#5e4b3c" }
  ];

  container.innerHTML = colorPalette.map(c => `
    <button type="button" class="color-swatch-btn ${c.hex === CustomizerState.garmentColor ? 'active-swatch' : ''}" 
      data-hex="${c.hex}" data-name="${c.name}" style="background-color: ${c.hex}" title="${c.name}"></button>
  `).join("");

  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".color-swatch-btn");
    if (!btn) return;
    container.querySelectorAll(".color-swatch-btn").forEach(b => b.classList.remove("active-swatch"));
    btn.classList.add("active-swatch");
    CustomizerState.garmentColor = btn.dataset.hex;
    CustomizerState.garmentColorName = btn.dataset.name;
    const colorLabel = document.getElementById("activeColorName");
    if (colorLabel) colorLabel.textContent = btn.dataset.name;
    renderCustomizerPreview();
  });
}

function updateSizeButtons() {
  const sizeContainer = document.getElementById("garmentSizeOptions");
  if (!sizeContainer) return;
  const garment = GarmentTypes[CustomizerState.garmentId];
  sizeContainer.innerHTML = garment.sizes.map(s => `
    <button type="button" class="size-pill-btn ${s === CustomizerState.size ? 'active-size' : ''}" data-size="${s}">${s}</button>
  `).join("");

  sizeContainer.querySelectorAll(".size-pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      sizeContainer.querySelectorAll(".size-pill-btn").forEach(b => b.classList.remove("active-size"));
      btn.classList.add("active-size");
      CustomizerState.size = btn.dataset.size;
    });
  });
}

function setupTextListeners() {
  const textInput = document.getElementById("customTextInput");
  const fontSelect = document.getElementById("customFontSelect");
  const fontSizeSlider = document.getElementById("customFontSizeSlider");
  const fontSizeDisplay = document.getElementById("fontSizeDisplay");
  const textColorInput = document.getElementById("customTextColorInput");
  const textRotateSlider = document.getElementById("customTextRotateSlider");
  const textRotateDisplay = document.getElementById("textRotateDisplay");
  const boldBtn = document.getElementById("textBoldBtn");

  if (textInput) {
    textInput.value = CustomizerState.text;
    textInput.addEventListener("input", (e) => {
      CustomizerState.text = e.target.value;
      renderCustomizerPreview();
    });
  }

  if (fontSelect) {
    fontSelect.value = CustomizerState.fontFamily;
    fontSelect.addEventListener("change", (e) => {
      CustomizerState.fontFamily = e.target.value;
      renderCustomizerPreview();
    });
  }

  if (fontSizeSlider) {
    fontSizeSlider.value = CustomizerState.fontSize;
    fontSizeSlider.addEventListener("input", (e) => {
      CustomizerState.fontSize = parseInt(e.target.value, 10);
      if (fontSizeDisplay) fontSizeDisplay.textContent = `${CustomizerState.fontSize}px`;
      renderCustomizerPreview();
    });
  }

  if (textColorInput) {
    textColorInput.value = CustomizerState.textColor;
    textColorInput.addEventListener("input", (e) => {
      CustomizerState.textColor = e.target.value;
      renderCustomizerPreview();
    });
  }

  if (textRotateSlider) {
    textRotateSlider.value = CustomizerState.textRotation;
    textRotateSlider.addEventListener("input", (e) => {
      CustomizerState.textRotation = parseInt(e.target.value, 10);
      if (textRotateDisplay) textRotateDisplay.textContent = `${CustomizerState.textRotation}°`;
      renderCustomizerPreview();
    });
  }

  if (boldBtn) {
    boldBtn.addEventListener("click", () => {
      CustomizerState.isBold = !CustomizerState.isBold;
      boldBtn.classList.toggle("bg-neutral-900", CustomizerState.isBold);
      boldBtn.classList.toggle("text-white", CustomizerState.isBold);
      renderCustomizerPreview();
    });
  }

  // Text Nudge Controls
  document.querySelectorAll("[data-text-nudge]").forEach(btn => {
    btn.addEventListener("click", () => {
      const dir = btn.dataset.textNudge;
      const step = 8;
      if (dir === "up") CustomizerState.textPosition.y -= step;
      if (dir === "down") CustomizerState.textPosition.y += step;
      if (dir === "left") CustomizerState.textPosition.x -= step;
      if (dir === "right") CustomizerState.textPosition.x += step;
      if (dir === "center") {
        CustomizerState.textPosition.x = 0;
        CustomizerState.textPosition.y = -40;
      }
      renderCustomizerPreview();
    });
  });
}

function setupImageControls() {
  const uploadInput = document.getElementById("customImageUploadInput");
  const scaleSlider = document.getElementById("customImageScaleSlider");
  const scaleDisplay = document.getElementById("imageScaleDisplay");
  const rotateSlider = document.getElementById("customImageRotateSlider");
  const rotateDisplay = document.getElementById("imageRotateDisplay");
  const removeImgBtn = document.getElementById("removeCustomImageBtn");

  // File Upload
  if (uploadInput) {
    uploadInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          CustomizerState.imageSrc = loadEvt.target.result;
          renderCustomizerPreview();
          if (removeImgBtn) removeImgBtn.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Remove image
  if (removeImgBtn) {
    removeImgBtn.addEventListener("click", () => {
      CustomizerState.imageSrc = null;
      if (uploadInput) uploadInput.value = "";
      removeImgBtn.classList.add("hidden");
      renderCustomizerPreview();
    });
  }

  // Scale slider
  if (scaleSlider) {
    scaleSlider.value = CustomizerState.imageScale;
    scaleSlider.addEventListener("input", (e) => {
      CustomizerState.imageScale = parseInt(e.target.value, 10);
      if (scaleDisplay) scaleDisplay.textContent = `${CustomizerState.imageScale}%`;
      renderCustomizerPreview();
    });
  }

  // Rotate slider
  if (rotateSlider) {
    rotateSlider.value = CustomizerState.imageRotation;
    rotateSlider.addEventListener("input", (e) => {
      CustomizerState.imageRotation = parseInt(e.target.value, 10);
      if (rotateDisplay) rotateDisplay.textContent = `${CustomizerState.imageRotation}°`;
      renderCustomizerPreview();
    });
  }

  // Image Nudge & Directional Controls (Left, Right, Top/Up, Down, Center)
  document.querySelectorAll("[data-img-nudge]").forEach(btn => {
    btn.addEventListener("click", () => {
      const dir = btn.dataset.imgNudge;
      const step = 8;
      if (dir === "up") CustomizerState.imagePosition.y -= step;
      if (dir === "down") CustomizerState.imagePosition.y += step;
      if (dir === "left") CustomizerState.imagePosition.x -= step;
      if (dir === "right") CustomizerState.imagePosition.x += step;
      if (dir === "center") {
        CustomizerState.imagePosition.x = 0;
        CustomizerState.imagePosition.y = 30;
      }
      renderCustomizerPreview();
    });
  });

  // Toggle boundary print guides
  const guideToggle = document.getElementById("togglePrintGuides");
  if (guideToggle) {
    guideToggle.addEventListener("change", (e) => {
      CustomizerState.showPrintGuides = e.target.checked;
      const guideBox = document.getElementById("printableBoundingArea");
      if (guideBox) {
        guideBox.classList.toggle("show-guide", CustomizerState.showPrintGuides);
      }
    });
  }
}

function setupPresetStickers() {
  const container = document.getElementById("presetStickersList");
  if (!container) return;

  container.innerHTML = PresetStickers.map((s, idx) => `
    <button type="button" class="preset-sticker-btn" data-sticker-idx="${idx}" title="${s.name}">
      ${s.svg ? s.svg : `<img src="${s.url}" alt="${s.name}" class="h-8 w-8 object-contain">`}
      <span class="text-xs">${s.name}</span>
    </button>
  `).join("");

  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".preset-sticker-btn");
    if (!btn) return;
    const sticker = PresetStickers[parseInt(btn.dataset.stickerIdx, 10)];
    if (sticker.svg) {
      // convert SVG to data URL
      const svgBlob = new Blob([sticker.svg], { type: "image/svg+xml;charset=utf-8" });
      CustomizerState.imageSrc = URL.createObjectURL(svgBlob);
    } else if (sticker.url) {
      CustomizerState.imageSrc = sticker.url;
    }
    const removeImgBtn = document.getElementById("removeCustomImageBtn");
    if (removeImgBtn) removeImgBtn.classList.remove("hidden");
    renderCustomizerPreview();
  });
}

function updatePriceDisplay() {
  const priceDisplay = document.getElementById("customizerPriceDisplay");
  if (!priceDisplay) return;
  const garment = GarmentTypes[CustomizerState.garmentId];
  let price = garment.basePrice;
  if (CustomizerState.imageSrc) price += 150; // graphic print premium
  if (CustomizerState.text && CustomizerState.text.trim()) price += 100; // typography custom
  priceDisplay.textContent = `₹${price.toLocaleString("en-IN")}`;
}

// RENDER PREVIEW: Applies garment color, mockup silhouettes, and STRICT BOUNDARY CLIPPING
function renderCustomizerPreview() {
  const garment = GarmentTypes[CustomizerState.garmentId];
  const garmentContainer = document.getElementById("mockupGarmentContainer");
  const printableArea = document.getElementById("printableBoundingArea");
  const textElement = document.getElementById("renderedCustomText");
  const imageElement = document.getElementById("renderedCustomImage");
  const silhouetteLayer = document.getElementById("mockupSilhouetteLayer");

  if (!garmentContainer || !printableArea) return;

  // 1. Apply base garment background color
  garmentContainer.style.backgroundColor = CustomizerState.garmentColor;

  // 2. Set SVG silhouette path for realistic garment outlines & fabric texture
  if (silhouetteLayer) {
    silhouetteLayer.innerHTML = getGarmentSvgSilhouette(garment.mockupType, CustomizerState.garmentColor);
  }

  // 3. Configure the Printable Boundary Area (STRICT CLIPPING MASK)
  // This uses CSS overflow:hidden so no image or text escapes outside the boundary!
  printableArea.style.top = garment.printBox.top;
  printableArea.style.left = garment.printBox.left;
  printableArea.style.width = garment.printBox.width;
  printableArea.style.height = garment.printBox.height;
  printableArea.style.borderRadius = garment.printBox.borderRadius;

  if (CustomizerState.showPrintGuides) {
    printableArea.classList.add("show-guide");
  } else {
    printableArea.classList.remove("show-guide");
  }

  // 4. Render Text with multilingual support, font, color, position & rotation
  if (textElement) {
    if (CustomizerState.text && CustomizerState.text.trim()) {
      textElement.style.display = "block";
      textElement.textContent = CustomizerState.text;
      textElement.style.fontFamily = CustomizerState.fontFamily;
      textElement.style.fontSize = `${CustomizerState.fontSize}px`;
      textElement.style.color = CustomizerState.textColor;
      textElement.style.fontWeight = CustomizerState.isBold ? "700" : "400";
      textElement.style.textAlign = CustomizerState.textAlign;
      textElement.style.transform = `translate(${CustomizerState.textPosition.x}px, ${CustomizerState.textPosition.y}px) rotate(${CustomizerState.textRotation}deg)`;
    } else {
      textElement.style.display = "none";
    }
  }

  // 5. Render Image with scale, rotation, and pan position
  if (imageElement) {
    if (CustomizerState.imageSrc) {
      imageElement.style.display = "block";
      imageElement.src = CustomizerState.imageSrc;
      // Convert imageScale % to width
      imageElement.style.maxWidth = `${CustomizerState.imageScale}%`;
      imageElement.style.maxHeight = `${CustomizerState.imageScale}%`;
      imageElement.style.transform = `translate(${CustomizerState.imagePosition.x}px, ${CustomizerState.imagePosition.y}px) rotate(${CustomizerState.imageRotation}deg)`;
    } else {
      imageElement.style.display = "none";
    }
  }

  updatePriceDisplay();
}

function getGarmentSvgSilhouette(type, color) {
  // SVG silhouettes designed for realistic garment draping, collars, and seams
  if (type === "tshirt" || type === "tshirt-crew") {
    return `
      <svg viewBox="0 0 500 500" class="w-full h-full pointer-events-none drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tshirtShade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"/>
            <stop offset="60%" stop-color="#000000" stop-opacity="0.04"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.22"/>
          </linearGradient>
        </defs>
        <!-- T-shirt Outline -->
        <path d="M160,85 C185,115 315,115 340,85 L435,130 L400,200 L345,185 L350,440 L150,440 L155,185 L100,200 L65,130 Z" fill="${color}" stroke="#000000" stroke-opacity="0.12" stroke-width="2"/>
        <!-- Shading Overlay -->
        <path d="M160,85 C185,115 315,115 340,85 L435,130 L400,200 L345,185 L350,440 L150,440 L155,185 L100,200 L65,130 Z" fill="url(#tshirtShade)"/>
        <!-- Collar Seam -->
        <path d="M160,85 C190,125 310,125 340,85 C310,105 190,105 160,85 Z" fill="#000000" fill-opacity="0.08"/>
        <!-- Sleeve creases -->
        <path d="M155,185 C145,210 135,215 100,200" stroke="#000000" stroke-opacity="0.1" stroke-width="1.5" fill="none"/>
        <path d="M345,185 C355,210 365,215 400,200" stroke="#000000" stroke-opacity="0.1" stroke-width="1.5" fill="none"/>
      </svg>
    `;
  } else if (type === "hoodie") {
    return `
      <svg viewBox="0 0 500 500" class="w-full h-full pointer-events-none drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
        <path d="M140,110 C180,140 320,140 360,110 L445,160 L405,240 L355,215 L360,450 L140,450 L145,215 L95,240 L55,160 Z" fill="${color}" stroke="#000000" stroke-opacity="0.15" stroke-width="2"/>
        <!-- Hood Layers -->
        <path d="M160,110 C160,40 340,40 340,110 C310,135 190,135 160,110 Z" fill="#000000" fill-opacity="0.12"/>
        <!-- Kangaroo Pocket -->
        <path d="M170,330 L330,330 L315,420 L185,420 Z" fill="#000000" fill-opacity="0.06" stroke="#000000" stroke-opacity="0.12" stroke-width="1.5"/>
      </svg>
    `;
  } else if (type === "jacket") {
    return `
      <svg viewBox="0 0 500 500" class="w-full h-full pointer-events-none drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
        <path d="M150,90 C190,120 310,120 350,90 L440,140 L395,225 L345,200 L345,445 L155,445 L155,200 L105,225 L60,140 Z" fill="${color}" stroke="#000000" stroke-opacity="0.2" stroke-width="2"/>
        <!-- Front zipper line -->
        <line x1="250" y1="110" x2="250" y2="445" stroke="#银色" stroke-width="3" stroke-dasharray="2,2" stroke-opacity="0.4"/>
      </svg>
    `;
  } else if (type === "tote") {
    return `
      <svg viewBox="0 0 500 500" class="w-full h-full pointer-events-none drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
        <!-- Handles -->
        <path d="M175,170 C175,60 210,50 250,50 C290,50 325,60 325,170" fill="none" stroke="${color}" stroke-width="22" stroke-linecap="round"/>
        <path d="M175,170 C175,60 210,50 250,50 C290,50 325,60 325,170" fill="none" stroke="#000000" stroke-opacity="0.12" stroke-width="22"/>
        <!-- Main Bag Body -->
        <rect x="110" y="165" width="280" height="300" rx="14" fill="${color}" stroke="#000000" stroke-opacity="0.15" stroke-width="2"/>
        <!-- Bottom Depth Fold -->
        <path d="M110,430 L390,430 L370,465 L130,465 Z" fill="#000000" fill-opacity="0.08"/>
      </svg>
    `;
  } else if (type === "phone-case") {
    return `
      <svg viewBox="0 0 500 500" class="w-full h-full pointer-events-none drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
        <!-- Phone Outline -->
        <rect x="140" y="60" width="220" height="380" rx="38" fill="${color}" stroke="#222222" stroke-width="4"/>
        <!-- Camera bump -->
        <rect x="160" y="80" width="85" height="90" rx="20" fill="#111111" fill-opacity="0.85"/>
        <circle cx="185" cy="105" r="14" fill="#222222" stroke="#444444" stroke-width="2"/>
        <circle cx="220" cy="105" r="14" fill="#222222" stroke="#444444" stroke-width="2"/>
        <circle cx="185" cy="145" r="14" fill="#222222" stroke="#444444" stroke-width="2"/>
      </svg>
    `;
  } else {
    // Journal
    return `
      <svg viewBox="0 0 500 500" class="w-full h-full pointer-events-none drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
        <!-- Book spine and cover -->
        <rect x="120" y="70" width="260" height="360" rx="12" fill="${color}" stroke="#111111" stroke-width="3"/>
        <rect x="120" y="70" width="30" height="360" fill="#000000" fill-opacity="0.18"/>
        <!-- Bookmark ribbon -->
        <path d="M220,70 L220,440 L230,425 L240,440 L240,70 Z" fill="#b91c1c"/>
      </svg>
    `;
  }
}

// Add customized product to Cart
function addCustomDesignToCart() {
  const garment = GarmentTypes[CustomizerState.garmentId];
  let calculatedPrice = garment.basePrice;
  if (CustomizerState.imageSrc) calculatedPrice += 150;
  if (CustomizerState.text && CustomizerState.text.trim()) calculatedPrice += 100;

  const customItem = {
    id: `custom-${Date.now()}`,
    name: `Custom ${garment.name}`,
    price: calculatedPrice,
    quantity: 1,
    size: CustomizerState.size,
    color: CustomizerState.garmentColorName,
    colorHex: CustomizerState.garmentColor,
    isCustom: true,
    customDetails: {
      text: CustomizerState.text,
      font: CustomizerState.fontFamily,
      textColor: CustomizerState.textColor,
      hasCustomImage: !!CustomizerState.imageSrc,
      imageScale: CustomizerState.imageScale
    },
    // We create a mini SVG snapshot for cart preview
    customThumbnail: generateCustomSnapshotSvg(garment, CustomizerState)
  };

  if (window.CartManager) {
    window.CartManager.addItem(customItem);
    // Show toast
    showToast(`Added custom ${garment.name} to cart!`);
  }
}

function generateCustomSnapshotSvg(garment, state) {
  return `
    <div style="background-color: ${state.garmentColor}; width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 8px;">
      <span style="font-family: ${state.fontFamily}; color: ${state.textColor}; font-size: 11px; font-weight: bold; text-align: center; max-width: 90%;">
        ${state.text || "CUSTOM"}
      </span>
    </div>
  `;
}

function showToast(message) {
  let toast = document.getElementById("appToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "appToast";
    toast.className = "fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-5 py-3 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-12 opacity-0 flex items-center gap-3";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
    <span class="text-sm font-medium">${message}</span>
  `;
  toast.classList.remove("translate-y-12", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");
  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-12", "opacity-0");
  }, 2800);
}

window.Customizer = {
  init: initCustomizer,
  state: CustomizerState,
  render: renderCustomizerPreview
};
