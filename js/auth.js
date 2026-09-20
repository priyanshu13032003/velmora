// Velmora - Authentication & Profile Manager
// Handles: Email/Password Login & Sign Up, Google OAuth simulation,
// Persistent localStorage session, and Profile dropdown menu.

const AuthManager = {
  currentUser: null,

  init() {
    this.loadSession();
    this.bindEvents();
    this.updateHeaderUI();
  },

  loadSession() {
    try {
      const stored = localStorage.getItem("velmora_user_session");
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load user session", e);
    }
  },

  saveSession(user) {
    this.currentUser = user;
    localStorage.setItem("velmora_user_session", JSON.stringify(user));
    this.updateHeaderUI();
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem("velmora_user_session");
    this.updateHeaderUI();
    showToast("Successfully signed out.");
    const dropdown = document.getElementById("profileDropdownMenu");
    if (dropdown) dropdown.classList.add("hidden");
  },

  bindEvents() {
    // Profile Header Button
    const profileBtn = document.getElementById("headerProfileBtn");
    const profileDropdown = document.getElementById("profileDropdownMenu");
    const authModal = document.getElementById("authModal");
    const closeAuthBtn = document.getElementById("closeAuthModalBtn");

    if (profileBtn) {
      profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.currentUser) {
          // Toggle profile dropdown
          if (profileDropdown) profileDropdown.classList.toggle("hidden");
        } else {
          // Open Auth Modal
          this.openAuthModal("login");
        }
      });
    }

    // Close dropdown on outside click
    document.addEventListener("click", (e) => {
      if (profileDropdown && !profileDropdown.contains(e.target) && e.target !== profileBtn) {
        profileDropdown.classList.add("hidden");
      }
    });

    // Close auth modal
    if (closeAuthBtn && authModal) {
      closeAuthBtn.addEventListener("click", () => {
        authModal.classList.add("hidden");
      });
    }

    // Tab switching in Auth Modal (Login vs Sign Up)
    const loginTab = document.getElementById("authTabLogin");
    const signupTab = document.getElementById("authTabSignup");
    const loginForm = document.getElementById("loginFormContainer");
    const signupForm = document.getElementById("signupFormContainer");

    if (loginTab && signupTab && loginForm && signupForm) {
      loginTab.addEventListener("click", () => {
        loginTab.classList.add("active-auth-tab");
        signupTab.classList.remove("active-auth-tab");
        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");
      });

      signupTab.addEventListener("click", () => {
        signupTab.classList.add("active-auth-tab");
        loginTab.classList.remove("active-auth-tab");
        signupForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
      });
    }

    // Login Form Submit
    const loginFormEl = document.getElementById("emailLoginForm");
    if (loginFormEl) {
      loginFormEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const name = email.split("@")[0].replace(/[^a-zA-Z]/g, " ").trim();
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1) || "Velmora Member";
        this.saveSession({
          name: formattedName,
          email: email,
          type: "email",
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}`,
          joinedDate: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" })
        });
        if (authModal) authModal.classList.add("hidden");
        showToast(`Welcome back, ${formattedName}!`);
      });
    }

    // Sign Up Form Submit
    const signupFormEl = document.getElementById("emailSignupForm");
    if (signupFormEl) {
      signupFormEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        this.saveSession({
          name: name,
          email: email,
          type: "email",
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
          joinedDate: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" })
        });
        if (authModal) authModal.classList.add("hidden");
        showToast(`Account created! Welcome to Velmora, ${name}!`);
      });
    }

    // Google Sign-In Buttons
    document.querySelectorAll(".google-signin-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.triggerGoogleOAuthSimulation();
      });
    });

    // Dropdown Logout Button
    const logoutBtn = document.getElementById("dropdownLogoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        this.logout();
      });
    }

    // View Orders button in dropdown
    const viewOrdersBtn = document.getElementById("dropdownOrdersBtn");
    if (viewOrdersBtn) {
      viewOrdersBtn.addEventListener("click", () => {
        if (profileDropdown) profileDropdown.classList.add("hidden");
        this.showOrdersModal();
      });
    }
  },

  openAuthModal(defaultTab = "login") {
    const authModal = document.getElementById("authModal");
    const loginTab = document.getElementById("authTabLogin");
    const signupTab = document.getElementById("authTabSignup");
    const loginForm = document.getElementById("loginFormContainer");
    const signupForm = document.getElementById("signupFormContainer");

    if (defaultTab === "signup") {
      signupTab.click();
    } else {
      loginTab.click();
    }
    if (authModal) authModal.classList.remove("hidden");
  },

  triggerGoogleOAuthSimulation() {
    // Show realistic Google OAuth pop-up simulation
    const overlay = document.createElement("div");
    overlay.id = "googleOAuthOverlay";
    overlay.className = "fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in";
    overlay.innerHTML = `
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
        <div class="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div class="flex items-center gap-2">
            <svg class="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span class="font-medium text-neutral-800 text-sm">Sign in with Google</span>
          </div>
          <button id="closeGooglePopup" class="text-neutral-400 hover:text-neutral-700 text-lg">&times;</button>
        </div>
        <div class="py-5 text-center">
          <p class="text-sm text-neutral-600 mb-4">Choose an account to continue to <strong>Velmora</strong></p>
          <div class="space-y-3">
            <button class="select-google-acc-btn w-full flex items-center gap-3 p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition text-left"
              data-name="Priyanshu Sharma" data-email="priyanshusharma740@gmail.com">
              <div class="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">PS</div>
              <div>
                <p class="text-sm font-semibold text-neutral-900">Priyanshu Sharma</p>
                <p class="text-xs text-neutral-500">priyanshusharma740@gmail.com</p>
              </div>
            </button>
            <button class="select-google-acc-btn w-full flex items-center gap-3 p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition text-left"
              data-name="Velmora Studio" data-email="studio@velmora.in">
              <div class="w-10 h-10 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-sm">VS</div>
              <div>
                <p class="text-sm font-semibold text-neutral-900">Velmora Creator</p>
                <p class="text-xs text-neutral-500">creator@velmora.in</p>
              </div>
            </button>
          </div>
        </div>
        <div class="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
          <span>To continue, Google will share your name and email.</span>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector("#closeGooglePopup").addEventListener("click", () => overlay.remove());

    overlay.querySelectorAll(".select-google-acc-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.dataset.name;
        const email = btn.dataset.email;
        overlay.remove();

        const authModal = document.getElementById("authModal");
        if (authModal) authModal.classList.add("hidden");

        this.saveSession({
          name: name,
          email: email,
          type: "google",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
          joinedDate: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" })
        });

        showToast(`Signed in as ${name} via Google!`);
      });
    });
  },

  updateHeaderUI() {
    const profileBtn = document.getElementById("headerProfileBtn");
    const userDisplay = document.getElementById("headerUserName");
    const avatarDisplay = document.getElementById("headerUserAvatar");
    const dropdownName = document.getElementById("dropdownUserName");
    const dropdownEmail = document.getElementById("dropdownUserEmail");
    const dropdownAvatar = document.getElementById("dropdownUserAvatar");

    if (this.currentUser) {
      if (userDisplay) userDisplay.textContent = this.currentUser.name.split(" ")[0];
      if (avatarDisplay) {
        avatarDisplay.innerHTML = `<img src="${this.currentUser.avatar}" alt="${this.currentUser.name}" class="w-7 h-7 rounded-full border border-neutral-300 object-cover">`;
      }
      if (dropdownName) dropdownName.textContent = this.currentUser.name;
      if (dropdownEmail) dropdownEmail.textContent = this.currentUser.email;
      if (dropdownAvatar) {
        dropdownAvatar.innerHTML = `<img src="${this.currentUser.avatar}" alt="${this.currentUser.name}" class="w-12 h-12 rounded-full border border-neutral-200 object-cover">`;
      }
    } else {
      if (userDisplay) userDisplay.textContent = "Log In";
      if (avatarDisplay) {
        avatarDisplay.innerHTML = `
          <svg class="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        `;
      }
    }
  },

  showOrdersModal() {
    const storedOrders = JSON.parse(localStorage.getItem("velmora_orders") || "[]");
    let ordersHtml = "";

    if (storedOrders.length === 0) {
      ordersHtml = `
        <div class="text-center py-10">
          <p class="text-neutral-400 mb-2">No past orders found.</p>
          <a href="#shop" class="text-sm font-semibold text-neutral-900 underline">Start shopping</a>
        </div>
      `;
    } else {
      ordersHtml = storedOrders.map(o => `
        <div class="p-4 rounded-xl border border-neutral-200 mb-3 bg-neutral-50/50">
          <div class="flex items-center justify-between mb-2">
            <span class="font-bold text-sm text-neutral-900">${o.orderId}</span>
            <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">${o.status || "Paid & Confirmed"}</span>
          </div>
          <p class="text-xs text-neutral-500 mb-2">Placed on ${o.date} • Total: <strong>₹${o.totalAmount.toLocaleString("en-IN")}</strong></p>
          <div class="text-xs text-neutral-600 space-y-1">
            ${o.items.map(it => `<div>• ${it.name} (${it.size}) × ${it.quantity}</div>`).join("")}
          </div>
        </div>
      `).join("");
    }

    const modal = document.createElement("div");
    modal.className = "fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm";
    modal.innerHTML = `
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 max-h-[85vh] flex flex-col">
        <div class="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
          <h3 class="text-lg font-bold text-neutral-900">My Orders & Tracking</h3>
          <button class="text-neutral-400 hover:text-neutral-700 text-xl close-orders-btn">&times;</button>
        </div>
        <div class="overflow-y-auto flex-1 pr-1">
          ${ordersHtml}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector(".close-orders-btn").addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
  }
};

window.AuthManager = AuthManager;
