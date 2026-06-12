# TravelEase – Travel Booking Platform (Demo)

A front-end demo of a travel booking platform with **Flights, Hotels & Cabs** search,
fare comparison, itinerary management, booking confirmations, travel alerts and
payment option UI. Built with plain **HTML, CSS & JavaScript** – no build step, no
backend required – so it deploys instantly to GitHub Pages, Vercel, Netlify, etc.

## 🌟 Features
- Tabbed search UI for Flights / Hotels / Cabs
- Mock search results with "Book Now" buttons
- Fare comparison table across providers
- Itinerary manager (saved in browser `localStorage`)
- Booking confirmation screen with a generated confirmation ID
- Travel alerts section
- Payment options UI (Card / UPI / Net Banking / Wallets)
- Login modal (demo only – plug in real auth later)
- Fully responsive layout

## 📁 Project Structure
```
travel-platform/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── data.js      # mock data – replace with real API calls
│   └── app.js        # UI logic
└── README.md
```

## 🔌 Connecting Real APIs (next steps)
This is a front-end shell. To make it a real booking platform, hook these up:
- **Flights**: Amadeus Self-Service API, Skyscanner Rapid API, Travelport
- **Hotels**: Booking.com Affiliate API, Amadeus Hotel Search, RateHawk
- **Cabs**: Uber API, Ola API, local cab aggregator APIs
- **Payments**: Razorpay, Stripe, PayU
- **Backend**: Node/Express, Firebase, or Supabase for real bookings, user auth, and storing itineraries instead of localStorage

Replace the contents of `js/data.js` with `fetch()` calls to these APIs, and update
`js/app.js`'s `renderResults()` to map the real response fields.

---

## 🚀 Deployment Steps

### Option 1: GitHub Pages (Free)
1. Create a new repository on GitHub (e.g. `travel-booking-platform`) under
   https://github.com/sriteja2006
2. Upload all files from this folder (`index.html`, `css/`, `js/`, `README.md`)
   to the repo — either via the GitHub web UI ("Add file → Upload files")
   or via git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - TravelEase platform"
   git branch -M main
   git remote add origin https://github.com/sriteja2006/travel-booking-platform.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, select **Deploy from a branch**.
5. Choose branch `main` and folder `/ (root)`, then click **Save**.
6. Wait 1–2 minutes. Your site will be live at:
   `https://sriteja2006.github.io/travel-booking-platform/`

### Option 2: Vercel (Free)
1. Push the project to a GitHub repo (same as steps 1–2 above).
2. Go to https://vercel.com and sign in with your GitHub account.
3. Click **Add New → Project**, select your `travel-booking-platform` repo.
4. Framework Preset: choose **Other** (it's static HTML — no build command needed).
5. Click **Deploy**. Vercel will give you a live URL like
   `https://travel-booking-platform.vercel.app`.
6. (Optional) Add a custom domain in Vercel's **Settings → Domains**.

### Option 3: Netlify (Free)
1. Push the project to GitHub (as above).
2. Go to https://app.netlify.com → **Add new site → Import an existing project**.
3. Connect GitHub, select the repo.
4. Build command: leave empty. Publish directory: `/` (root).
5. Click **Deploy site**.

### Option 4: Quick Local Preview
Just open `index.html` directly in your browser — everything works without a server
since it's pure static HTML/CSS/JS.

---

Made as a starter template — extend the mock data and forms to fit your real
business logic and API integrations.
