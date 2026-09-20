// Velmora - Checkout & Payment Approval Manager
// Multi-step checkout: Shipping Address -> Payment Gateway Face -> Bank Payment Approval Flow -> Order Confirmation

const CheckoutManager = {
  currentStep: 1,
  selectedPaymentMethod: "card",
  shippingData: null,

  init() {
    this.bindEvents();
  },

  openCheckoutModal() {
    this.currentStep = 1;
    const modal = document.getElementById("checkoutModal");
    if (modal) {
      modal.classList.remove("hidden");
      this.renderCheckoutSummary();
      this.showStep(1);
    }
  },

  closeCheckoutModal() {
    const modal = document.getElementById("checkoutModal");
    if (modal) modal.classList.add("hidden");
  },

  showStep(stepNum) {
    this.currentStep = stepNum;
    document.querySelectorAll(".checkout-step-content").forEach(el => el.classList.add("hidden"));
    const target = document.getElementById(`checkoutStep${stepNum}`);
    if (target) target.classList.remove("hidden");

    // Update step indicator pills
    document.querySelectorAll(".step-indicator-pill").forEach(pill => {
      const pillStep = parseInt(pill.dataset.step, 10);
      pill.classList.toggle("active-step", pillStep === stepNum);
      pill.classList.toggle("completed-step", pillStep < stepNum);
    });
  },

  renderCheckoutSummary() {
    const listEl = document.getElementById("checkoutOrderItemsList");
    const subtotalEl = document.getElementById("checkoutSubtotalDisplay");
    const discountEl = document.getElementById("checkoutDiscountDisplay");
    const shippingEl = document.getElementById("checkoutShippingDisplay");
    const totalEl = document.getElementById("checkoutTotalDisplay");

    if (!window.CartManager || !listEl) return;

    const items = window.CartManager.items;
    listEl.innerHTML = items.map(it => `
      <div class="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0 text-xs">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-neutral-900">${it.quantity}×</span>
          <span class="text-neutral-700 truncate max-w-[160px]">${it.name} (${it.size})</span>
        </div>
        <span class="font-bold text-neutral-900">₹${(it.price * it.quantity).toLocaleString("en-IN")}</span>
      </div>
    `).join("");

    if (subtotalEl) subtotalEl.textContent = `₹${window.CartManager.getSubtotal().toLocaleString("en-IN")}`;
    if (discountEl) discountEl.textContent = `-₹${window.CartManager.getDiscount().toLocaleString("en-IN")}`;
    if (shippingEl) shippingEl.textContent = window.CartManager.getShippingFee() === 0 ? "FREE" : `₹${window.CartManager.getShippingFee()}`;
    if (totalEl) totalEl.textContent = `₹${window.CartManager.getTotal().toLocaleString("en-IN")}`;
  },

  bindEvents() {
    const closeBtn = document.getElementById("closeCheckoutModalBtn");
    if (closeBtn) closeBtn.addEventListener("click", () => this.closeCheckoutModal());

    // Step 1: Address Form Submit -> Go to Step 2
    const addressForm = document.getElementById("shippingAddressForm");
    if (addressForm) {
      addressForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.shippingData = {
          name: document.getElementById("shipName").value.trim(),
          email: document.getElementById("shipEmail").value.trim(),
          phone: document.getElementById("shipPhone").value.trim(),
          address: document.getElementById("shipAddress").value.trim(),
          city: document.getElementById("shipCity").value.trim(),
          state: document.getElementById("shipState").value.trim(),
          pincode: document.getElementById("shipPincode").value.trim()
        };
        this.showStep(2);
      });
    }

    // Step 2: Back to Address
    const backToAddressBtn = document.getElementById("backToAddressBtn");
    if (backToAddressBtn) {
      backToAddressBtn.addEventListener("click", () => this.showStep(1));
    }

    // Payment method selector tabs
    document.querySelectorAll(".payment-method-option").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".payment-method-option").forEach(b => b.classList.remove("selected-payment"));
        btn.classList.add("selected-payment");
        this.selectedPaymentMethod = btn.dataset.method;

        // Show corresponding payment form
        document.querySelectorAll(".payment-subform").forEach(f => f.classList.add("hidden"));
        const targetForm = document.getElementById(`paymentSubform-${this.selectedPaymentMethod}`);
        if (targetForm) targetForm.classList.remove("hidden");
      });
    });

    // Step 2: Pay Now Button -> Trigger Bank Payment Approval
    const payNowBtn = document.getElementById("payNowButton");
    if (payNowBtn) {
      payNowBtn.addEventListener("click", () => {
        this.processPaymentApproval();
      });
    }
  },

  processPaymentApproval() {
    const approvalOverlay = document.getElementById("paymentApprovalModal");
    const approvalTitle = document.getElementById("approvalStatusTitle");
    const approvalSub = document.getElementById("approvalStatusSubtitle");
    const approvalSpinner = document.getElementById("approvalSpinner");
    const approvalSuccessIcon = document.getElementById("approvalSuccessIcon");

    if (!approvalOverlay) return;

    // Show approval modal
    approvalOverlay.classList.remove("hidden");
    if (approvalSpinner) approvalSpinner.classList.remove("hidden");
    if (approvalSuccessIcon) approvalSuccessIcon.classList.add("hidden");

    approvalTitle.textContent = "Connecting to Secure Gateway...";
    approvalSub.textContent = "Encrypting transaction with 256-bit bank security...";

    setTimeout(() => {
      approvalTitle.textContent = "Contacting Your Bank for Approval...";
      approvalSub.textContent = "Verifying credit limits and anti-fraud approval...";
    }, 1200);

    setTimeout(() => {
      // Payment Approved!
      if (approvalSpinner) approvalSpinner.classList.add("hidden");
      if (approvalSuccessIcon) approvalSuccessIcon.classList.remove("hidden");
      approvalTitle.textContent = "Payment Approved!";
      approvalSub.textContent = "Transaction verified by bank. Generating order receipt...";

      setTimeout(() => {
        approvalOverlay.classList.add("hidden");
        this.finalizeOrder();
      }, 1500);
    }, 2800);
  },

  finalizeOrder() {
    const orderId = `VEL-${Math.floor(100000 + Math.random() * 900000)}`;
    const totalAmount = window.CartManager.getTotal();
    const orderItems = [...window.CartManager.items];

    const orderObj = {
      orderId: orderId,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      items: orderItems,
      shipping: this.shippingData,
      paymentMethod: this.selectedPaymentMethod.toUpperCase(),
      subtotal: window.CartManager.getSubtotal(),
      discount: window.CartManager.getDiscount(),
      shippingFee: window.CartManager.getShippingFee(),
      totalAmount: totalAmount,
      status: "Payment Approved & Processing"
    };

    // Save to user orders in localStorage
    try {
      const orders = JSON.parse(localStorage.getItem("velmora_orders") || "[]");
      orders.unshift(orderObj);
      localStorage.setItem("velmora_orders", JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to save order", e);
    }

    // Clear cart
    window.CartManager.clearCart();

    // Render Step 3: Order Confirmation
    this.renderOrderConfirmation(orderObj);
    this.showStep(3);
  },

  renderOrderConfirmation(order) {
    const orderIdEl = document.getElementById("confirmedOrderId");
    const orderDateEl = document.getElementById("confirmedOrderDate");
    const orderTotalEl = document.getElementById("confirmedOrderTotal");
    const orderMethodEl = document.getElementById("confirmedPaymentMethod");
    const shipNameEl = document.getElementById("confirmedShipName");
    const shipAddrEl = document.getElementById("confirmedShipAddress");
    const itemsEl = document.getElementById("confirmedItemsBreakdown");

    if (orderIdEl) orderIdEl.textContent = order.orderId;
    if (orderDateEl) orderDateEl.textContent = order.date;
    if (orderTotalEl) orderTotalEl.textContent = `₹${order.totalAmount.toLocaleString("en-IN")}`;
    if (orderMethodEl) orderMethodEl.textContent = order.paymentMethod;

    if (order.shipping) {
      if (shipNameEl) shipNameEl.textContent = order.shipping.name;
      if (shipAddrEl) shipAddrEl.textContent = `${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state} - ${order.shipping.pincode}`;
    }

    if (itemsEl) {
      itemsEl.innerHTML = order.items.map(it => `
        <div class="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0 text-xs">
          <div>
            <p class="font-semibold text-neutral-900">${it.name}</p>
            <p class="text-neutral-500">${it.size || ''} • Qty: ${it.quantity}</p>
          </div>
          <span class="font-bold text-neutral-900">₹${(it.price * it.quantity).toLocaleString("en-IN")}</span>
        </div>
      `).join("");
    }

    const continueShoppingBtn = document.getElementById("continueShoppingBtn");
    if (continueShoppingBtn) {
      continueShoppingBtn.addEventListener("click", () => {
        this.closeCheckoutModal();
        window.location.hash = "#shop";
      });
    }

    const printReceiptBtn = document.getElementById("printReceiptBtn");
    if (printReceiptBtn) {
      printReceiptBtn.addEventListener("click", () => {
        window.print();
      });
    }
  }
};

window.CheckoutManager = CheckoutManager;
