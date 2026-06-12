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

// ===== Itinerary state =====
let itinerary = JSON.parse(localStorage.getItem("itinerary") || "[]");

function saveItinerary() {
  localStorage.setItem("itinerary", JSON.stringify(itinerary));
  renderItinerary();
}

function renderItinerary() {
  const list = document.getElementById("itineraryList");
  const empty = document.getElementById("itineraryEmpty");
  list.innerHTML = "";

  if (itinerary.length === 0) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  itinerary.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "itinerary-item";
    div.innerHTML = `
      <div class="info">
        <strong>${item.title}</strong>
        <span>${item.detail} · ₹${item.price}</span>
      </div>
      <button class="remove-btn" data-idx="${idx}">Remove</button>
    `;
    list.appendChild(div);
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      itinerary.splice(btn.dataset.idx, 1);
      saveItinerary();
    });
  });
}

// ===== Render results =====
function renderResults(type, items) {
  const grid = document.getElementById("resultsGrid");
  grid.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "result-card";

    let title, meta;
    if (type === "flights") {
      title = `${item.airline} (${item.id})`;
      meta = `${item.from} → ${item.to} · ${item.time} · ${item.stops}`;
    } else if (type === "hotels") {
      title = item.name;
      meta = `${item.location} · ⭐ ${item.rating} · ${item.amenities}`;
    } else {
      title = `${item.type} - ${item.car}`;
      meta = `Arrives in ${item.eta}`;
    }

    card.innerHTML = `
      <h3>${title}</h3>
      <div class="meta">${meta}</div>
      <div class="price">₹${item.price}${type === "hotels" ? "/night" : ""}</div>
      <button class="btn btn-primary book-btn">Book Now</button>
    `;

    card.querySelector(".book-btn").addEventListener("click", () => {
      bookItem(type, item, title);
    });

    grid.appendChild(card);
  });

  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
}

// ===== Booking flow =====
function bookItem(type, item, title) {
  const confirmId = "TRV-" + Math.floor(100000 + Math.random() * 900000);

  itinerary.push({
    type,
    title,
    detail: type === "flights" ? `${item.from} → ${item.to}` :
            type === "hotels" ? item.location : `Arrives in ${item.eta}`,
    price: item.price,
    confirmId
  });
  saveItinerary();

  document.getElementById("confirmId").textContent = confirmId;
  document.getElementById("confirmation").style.display = "flex";
  document.getElementById("confirmation").scrollIntoView({ behavior: "smooth" });
}

document.getElementById("closeConfirm").addEventListener("click", () => {
  document.getElementById("confirmation").style.display = "none";
});

// ===== Form submissions =====
document.getElementById("flights-form").addEventListener("submit", e => {
  e.preventDefault();
  renderResults("flights", MOCK_FLIGHTS);
});

document.getElementById("hotels-form").addEventListener("submit", e => {
  e.preventDefault();
  renderResults("hotels", MOCK_HOTELS);
});

document.getElementById("cabs-form").addEventListener("submit", e => {
  e.preventDefault();
  renderResults("cabs", MOCK_CABS);
});

// ===== Login modal =====
const loginModal = document.getElementById("loginModal");
document.getElementById("loginBtn").addEventListener("click", () => {
  loginModal.classList.add("active");
});
document.getElementById("closeModal").addEventListener("click", () => {
  loginModal.classList.remove("active");
});
loginModal.addEventListener("click", e => {
  if (e.target === loginModal) loginModal.classList.remove("active");
});
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("Demo login successful! (Connect this to a real auth backend)");
  loginModal.classList.remove("active");
});

// ===== Init =====
renderItinerary();
