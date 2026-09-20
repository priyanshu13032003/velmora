// Velmora - Shopping Cart Manager
// Handles: Item management, slide-over drawer, promo code discounts, and checkout trigger.

const CartManager = {
  items: [],
  appliedCoupon: null,
  availableCoupons: {
    "VELMORA10": { type: "percent", value: 10, label: "10% Off Your Order" },
    "WELCOME50": { type: "flat", value: 50, label: "₹50 Off Welcome Bonus" },
    "FREESHIP": { type: "freeship", value: 0, label: "Free Express Delivery" }
  },

  init() {
    this.loadCart();
    this.bindEvents();
    this.updateCartUI();
  },

  loadCart() {
    try {
      const stored = localStorage.getItem("velmora_cart");
      if (stored) {
        this.items = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error loading cart", e);
    }
  },

  saveCart() {
    localStorage.setItem("velmora_cart", JSON.stringify(this.items));
    this.updateCartUI();
  },

  addItem(product) {
    // Check if identical item already in cart (same id, size, color, isCustom)
    const existingIndex = this.items.findIndex(item => 
      item.id === product.id && 
      item.size === product.size && 
      item.color === product.color &&
      !item.isCustom
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += product.quantity || 1;
    } else {
      this.items.push({
        ...product,
        quantity: product.quantity || 1
      });
    }

    this.saveCart();
    this.openDrawer();
  },

  removeItem(index) {
    this.items.splice(index, 1);
    this.saveCart();
  },

  updateQuantity(index, newQty) {
    if (newQty <= 0) {
      this.removeItem(index);
    } else {
      this.items[index].quantity = newQty;
      this.saveCart();
    }
  },

  clearCart() {
    this.items = [];
    this.appliedCoupon = null;
    this.saveCart();
  },

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getDiscount() {
    const subtotal = this.getSubtotal();
    if (!this.appliedCoupon) return 0;
    if (this.appliedCoupon.type === "percent") {
      return Math.round((subtotal * this.appliedCoupon.value) / 100);
    }
    if (this.appliedCoupon.type === "flat") {
      return Math.min(this.appliedCoupon.value, subtotal);
    }
    return 0;
  },

  getShippingFee() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    if (this.appliedCoupon && this.appliedCoupon.type === "freeship") return 0;
    // Free delivery over ₹999
    return subtotal >= 999 ? 0 : 99;
  },

  getTotal() {
    const subtotal = this.getSubtotal();
    const discount = this.getDiscount();
    const shipping = this.getShippingFee();
    return Math.max(0, subtotal - discount + shipping);
  },

  openDrawer() {
    const drawer = document.getElementById("cartSlideOverDrawer");
    const backdrop = document.getElementById("cartDrawerBackdrop");
    if (drawer && backdrop) {
      drawer.classList.remove("translate-x-full");
      backdrop.classList.remove("opacity-0", "pointer-events-none");
    }
  },

  closeDrawer() {
    const drawer = document.getElementById("cartSlideOverDrawer");
    const backdrop = document.getElementById("cartDrawerBackdrop");
    if (drawer && backdrop) {
      drawer.classList.add("translate-x-full");
      backdrop.classList.add("opacity-0", "pointer-events-none");
    }
  },

  bindEvents() {
    // Header cart button
    const cartBtn = document.getElementById("headerCartBtn");
    if (cartBtn) {
      cartBtn.addEventListener("click", () => this.openDrawer());
    }

    // Close button
    const closeBtn = document.getElementById("closeCartDrawerBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeDrawer());
    }

    // Backdrop click
    const backdrop = document.getElementById("cartDrawerBackdrop");
    if (backdrop) {
      backdrop.addEventListener("click", () => this.closeDrawer());
    }

    // Promo code apply
    const promoInput = document.getElementById("cartPromoInput");
    const promoBtn = document.getElementById("applyPromoBtn");
    const promoMsg = document.getElementById("promoCodeMessage");

    if (promoBtn && promoInput) {
      promoBtn.addEventListener("click", () => {
        const code = promoInput.value.trim().toUpperCase();
        if (this.availableCoupons[code]) {
          this.appliedCoupon = { code, ...this.availableCoupons[code] };
          if (promoMsg) {
            promoMsg.innerHTML = `<span class="text-emerald-600 font-medium">Coupon "${code}" applied: ${this.appliedCoupon.label}</span>`;
          }
          this.updateCartUI();
        } else {
          if (promoMsg) {
            promoMsg.innerHTML = `<span class="text-rose-600 font-medium">Invalid coupon code. Try "VELMORA10"</span>`;
          }
        }
      });
    }

    // Checkout button
    const checkoutBtn = document.getElementById("proceedToCheckoutBtn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        if (this.items.length === 0) {
          showToast("Your cart is empty!");
          return;
        }
        this.closeDrawer();
        if (window.CheckoutManager) {
          window.CheckoutManager.openCheckoutModal();
        }
      });
    }
  },

  updateCartUI() {
    const countBadges = document.querySelectorAll(".cart-count-badge");
    const itemsList = document.getElementById("cartItemsList");
    const emptyState = document.getElementById("cartEmptyState");
    const subtotalEl = document.getElementById("cartSubtotalDisplay");
    const discountRow = document.getElementById("cartDiscountRow");
    const discountEl = document.getElementById("cartDiscountDisplay");
    const shippingEl = document.getElementById("cartShippingDisplay");
    const totalEl = document.getElementById("cartTotalDisplay");

    const totalQty = this.items.reduce((s, it) => s + it.quantity, 0);

    countBadges.forEach(b => {
      b.textContent = totalQty;
      b.classList.toggle("hidden", totalQty === 0);
    });

    if (!itemsList) return;

    if (this.items.length === 0) {
      itemsList.innerHTML = "";
      if (emptyState) emptyState.classList.remove("hidden");
    } else {
      if (emptyState) emptyState.classList.add("hidden");
      itemsList.innerHTML = this.items.map((item, idx) => `
        <div class="flex items-start gap-4 py-4 border-b border-neutral-100 last:border-0">
          <div class="w-16 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200 flex items-center justify-center">
            ${item.isCustom 
              ? item.customThumbnail 
              : `<img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">`}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <h4 class="font-semibold text-sm text-neutral-900 truncate pr-2">${item.name}</h4>
              <button type="button" class="text-neutral-400 hover:text-rose-500 remove-cart-item-btn text-xs" data-idx="${idx}">
                &times; Remove
              </button>
            </div>
            <p class="text-xs text-neutral-500 mt-0.5">
              ${item.size ? `Size: <strong>${item.size}</strong>` : ''} 
              ${item.color ? `• Color: <strong>${item.color}</strong>` : ''}
              ${item.isCustom ? `<span class="ml-1 text-indigo-600 font-semibold">(Custom Print)</span>` : ''}
            </p>
            <div class="flex items-center justify-between mt-3">
              <div class="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white">
                <button type="button" class="px-2 py-1 text-neutral-600 hover:bg-neutral-100 qty-dec-btn" data-idx="${idx}">-</button>
                <span class="px-3 text-xs font-semibold">${item.quantity}</span>
                <button type="button" class="px-2 py-1 text-neutral-600 hover:bg-neutral-100 qty-inc-btn" data-idx="${idx}">+</button>
              </div>
              <span class="font-bold text-sm text-neutral-900">₹${(item.price * item.quantity).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      `).join("");

      // Bind dynamic item buttons
      itemsList.querySelectorAll(".remove-cart-item-btn").forEach(btn => {
        btn.addEventListener("click", () => this.removeItem(parseInt(btn.dataset.idx, 10)));
      });
      itemsList.querySelectorAll(".qty-dec-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.idx, 10);
          this.updateQuantity(idx, this.items[idx].quantity - 1);
        });
      });
      itemsList.querySelectorAll(".qty-inc-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.idx, 10);
          this.updateQuantity(idx, this.items[idx].quantity + 1);
        });
      });
    }

    // Totals
    const subtotal = this.getSubtotal();
    const discount = this.getDiscount();
    const shipping = this.getShippingFee();
    const total = this.getTotal();

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
    
    if (discountRow) {
      if (discount > 0) {
        discountRow.classList.remove("hidden");
        if (discountEl) discountEl.textContent = `-₹${discount.toLocaleString("en-IN")}`;
      } else {
        discountRow.classList.add("hidden");
      }
    }

    if (shippingEl) {
      shippingEl.textContent = shipping === 0 ? "FREE" : `₹${shipping}`;
      if (shipping === 0) shippingEl.className = "text-emerald-600 font-bold";
      else shippingEl.className = "text-neutral-900 font-semibold";
    }

    if (totalEl) totalEl.textContent = `₹${total.toLocaleString("en-IN")}`;
  }
};

window.CartManager = CartManager;
