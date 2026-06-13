// ===== Tab switching =====
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(`${tab.dataset.tab}-form`).classList.add("active");
  });
});

// ===== Auth state =====
let authToken = localStorage.getItem("token") || null;
let currentUser = JSON.parse(localStorage.getItem("user") || "null");

function updateAuthUI() {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userPill = document.getElementById("userPill");

  if (currentUser) {
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    userPill.style.display = "inline-block";
    userPill.textContent = "👤 " + currentUser.name;
  } else {
    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    userPill.style.display = "none";
  }
}

function authHeaders() {
  return authToken ? { "Authorization": "Bearer " + authToken } : {};
}

// ===== Modals =====
const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");

document.getElementById("loginBtn").addEventListener("click", () => loginModal.classList.add("active"));
document.getElementById("signupBtn").addEventListener("click", () => signupModal.classList.add("active"));
document.getElementById("closeModal").addEventListener("click", () => loginModal.classList.remove("active"));
document.getElementById("closeSignupModal").addEventListener("click", () => signupModal.classList.remove("active"));

[loginModal, signupModal].forEach(modal => {
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("active");
  });
});

document.getElementById("switchToSignup").addEventListener("click", e => {
  e.preventDefault();
  loginModal.classList.remove("active");
  signupModal.classList.add("active");
});
document.getElementById("switchToLogin").addEventListener("click", e => {
  e.preventDefault();
  signupModal.classList.remove("active");
  loginModal.classList.add("active");
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  authToken = null;
  currentUser = null;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  updateAuthUI();
  itinerary = [];
  renderItinerary();
});

// ===== Login form =====
document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const errorEl = document.getElementById("loginError");
  errorEl.textContent = "";

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error || "Login failed";
      return;
    }

    authToken = data.token;
    currentUser = data.user;
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(currentUser));

    updateAuthUI();
    loginModal.classList.remove("active");
    e.target.reset();
    fetchItinerary();
  } catch (err) {
    errorEl.textContent = "Could not connect to server. Is the backend running?";
  }
});

// ===== Signup form =====
document.getElementById("signupForm").addEventListener("submit", async e => {
  e.preventDefault();
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const errorEl = document.getElementById("signupError");
  errorEl.textContent = "";

  try {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error || "Signup failed";
      return;
    }

    authToken = data.token;
    currentUser = data.user;
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(currentUser));

    updateAuthUI();
    signupModal.classList.remove("active");
    e.target.reset();
    fetchItinerary();
  } catch (err) {
    errorEl.textContent = "Could not connect to server. Is the backend running?";
  }
});

// ===== Itinerary state =====
let itinerary = [];

function renderItinerary() {
  const list = document.getElementById("itineraryList");
  const empty = document.getElementById("itineraryEmpty");
  list.innerHTML = "";

  if (!currentUser) {
    empty.style.display = "block";
    empty.textContent = "Login to view and save your itinerary.";
    return;
  }

  if (itinerary.length === 0) {
    empty.style.display = "block";
    empty.textContent = "No items added yet. Add a booking from the results above.";
    return;
  }
  empty.style.display = "none";

  itinerary.forEach(item => {
    const div = document.createElement("div");
    div.className = "itinerary-item";
    div.innerHTML = `
      <div class="info">
        <strong>${item.title}</strong>
        <span>${item.detail || ""} · ₹${item.price} · ${item.confirm_id}</span>
      </div>
      <button class="remove-btn" data-id="${item.id}">Remove</button>
    `;
    list.appendChild(div);
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      await fetch(`${API_BASE_URL}/bookings/${btn.dataset.id}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      fetchItinerary();
    });
  });
}

async function fetchItinerary() {
  if (!currentUser) {
    itinerary = [];
    renderItinerary();
    return;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/bookings`, { headers: authHeaders() });
    const data = await res.json();
    itinerary = data.bookings || [];
  } catch (err) {
    itinerary = [];
  }
  renderItinerary();
}

// ===== Render search results =====
function renderResults(type, items) {
  const grid = document.getElementById("resultsGrid");
  grid.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "result-card";

    let title, meta, detail;
    if (type === "flights") {
      title = `${item.airline} (${item.id})`;
      meta = `${item.from} → ${item.to} · ${item.time} · ${item.stops}`;
      detail = `${item.from} → ${item.to}`;
    } else if (type === "hotels") {
      title = item.name;
      meta = `${item.location} · ⭐ ${item.rating} · ${item.amenities}`;
      detail = item.location;
    } else {
      title = `${item.type} - ${item.car}`;
      meta = `Arrives in ${item.eta}`;
      detail = `Arrives in ${item.eta}`;
    }

    card.innerHTML = `
      <h3>${title}</h3>
      <div class="meta">${meta}</div>
      <div class="price">₹${item.price}${type === "hotels" ? "/night" : ""}</div>
      <button class="btn btn-primary book-btn">Book Now</button>
    `;

    card.querySelector(".book-btn").addEventListener("click", () => {
      bookItem(type, item, title, detail);
    });

    grid.appendChild(card);
  });

  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
}

// ===== Booking flow =====
async function bookItem(type, item, title, detail) {
  if (!currentUser) {
    alert("Please login or sign up to book and save items to your itinerary.");
    loginModal.classList.add("active");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ type, title, detail, price: item.price })
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Booking failed");
      return;
    }

    fetchItinerary();

    document.getElementById("confirmId").textContent = data.booking.confirm_id;
    document.getElementById("confirmation").style.display = "flex";
    document.getElementById("confirmation").scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    alert("Could not connect to server. Is the backend running?");
  }
}

document.getElementById("closeConfirm").addEventListener("click", () => {
  document.getElementById("confirmation").style.display = "none";
});

// ===== Search forms =====
document.getElementById("flights-form").addEventListener("submit", async e => {
  e.preventDefault();
  try {
    const res = await fetch(`${API_BASE_URL}/search/flights`);
    const data = await res.json();
    renderResults("flights", data.results || MOCK_FLIGHTS);
  } catch (err) {
    renderResults("flights", MOCK_FLIGHTS);
  }
});

document.getElementById("hotels-form").addEventListener("submit", async e => {
  e.preventDefault();
  try {
    const res = await fetch(`${API_BASE_URL}/search/hotels`);
    const data = await res.json();
    renderResults("hotels", data.results || MOCK_HOTELS);
  } catch (err) {
    renderResults("hotels", MOCK_HOTELS);
  }
});

document.getElementById("cabs-form").addEventListener("submit", async e => {
  e.preventDefault();
  try {
    const res = await fetch(`${API_BASE_URL}/search/cabs`);
    const data = await res.json();
    renderResults("cabs", data.results || MOCK_CABS);
  } catch (err) {
    renderResults("cabs", MOCK_CABS);
  }
});

// ===== Init =====
updateAuthUI();
fetchItinerary();
