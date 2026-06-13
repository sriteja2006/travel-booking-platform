# TravelEase – Travel Booking Platform (Full Stack)

A full-stack travel booking demo:
- **Frontend**: HTML/CSS/JS (static, deploy to GitHub Pages / Vercel / Netlify)
- **Backend**: Node.js + Express REST API with **real authentication** (JWT + bcrypt),
  itinerary storage, and search endpoints for flights/hotels/cabs (deploy to Render / Railway / Fly.io)

## 📁 Project Structure
```
travel-platform/
├── index.html
├── css/style.css
├── js/
│   ├── config.js     # <-- set your backend URL here
│   ├── data.js        # fallback mock data
│   └── app.js
└── backend/
    ├── server.js
    ├── package.json
    ├── config/db.js          # lowdb (JSON file) database
    ├── middleware/auth.js     # JWT verification
    └── routes/
        ├── auth.js            # /api/auth/signup, /login, /me
        ├── bookings.js        # /api/bookings (itinerary CRUD)
        └── search.js          # /api/search/flights|hotels|cabs
```

## 🔑 Authentication
Real signup/login backed by:
- **bcryptjs** – password hashing
- **jsonwebtoken** – issues a JWT on login/signup (7 day expiry)
- **lowdb** – stores users & bookings in a local `db.json` file (no external DB needed; swap for Postgres/Mongo later if you scale)

### Endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | – | `{name, email, password}` → `{token, user}` |
| POST | `/api/auth/login` | – | `{email, password}` → `{token, user}` |
| GET | `/api/auth/me` | ✅ | Returns current user |
| GET | `/api/bookings` | ✅ | List logged-in user's itinerary |
| POST | `/api/bookings` | ✅ | `{type, title, detail, price}` → adds booking |
| DELETE | `/api/bookings/:id` | ✅ | Remove a booking |
| GET | `/api/search/flights` | – | Mock flight results |
| GET | `/api/search/hotels` | – | Mock hotel results |
| GET | `/api/search/cabs` | – | Mock cab results |

Send the JWT as `Authorization: Bearer <token>` for protected routes.

---

## 🖥️ Run Locally

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env     # edit JWT_SECRET to something random
npm start                  # runs on http://localhost:5000
```

### 2. Frontend
`js/config.js` already points to `http://localhost:5000/api` when running on `localhost`.
Just open `index.html` in your browser (or use a simple static server like `npx serve .`).

Try: Sign Up → Login → search flights → "Book Now" → see it appear in **My Itinerary**.

---

## 🚀 Deployment

### Step 1 — Deploy the Backend (Render.com — free tier)
1. Push the whole project (including `backend/`) to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - TravelEase full stack"
   git branch -M main
   git remote add origin https://github.com/sriteja2006/travel-booking-platform.git
   git push -u origin main
   ```
2. Go to https://render.com → sign in with GitHub.
3. Click **New → Web Service**, select your repo.
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance type**: Free
5. Add environment variable: `JWT_SECRET` = (any long random string)
6. Click **Create Web Service**. You'll get a URL like:
   `https://travel-booking-api.onrender.com`

> Alternative backend hosts: **Railway.app**, **Fly.io**, **Cyclic.sh** — all support Node + Express free tiers similarly.

### Step 2 — Update Frontend Config
Edit `js/config.js` and replace the placeholder with your real backend URL:
```js
const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000/api"
  : "https://travel-booking-api.onrender.com/api";
```

### Step 3 — Deploy the Frontend

#### Option A: GitHub Pages
1. In your repo, go to **Settings → Pages**.
2. **Source**: Deploy from a branch → branch `main`, folder `/ (root)` → Save.
3. Live at: `https://sriteja2006.github.io/travel-booking-platform/`

> Note: GitHub Pages will also try to serve the `backend/` folder — that's fine, it's just static files sitting there unused on Pages.

#### Option B: Vercel
1. https://vercel.com → **Add New → Project** → import your repo.
2. Framework Preset: **Other**.
3. **Root Directory**: leave as `/` (the repo root, since `index.html` is at root).
4. Deploy → get a URL like `https://travel-booking-platform.vercel.app`

#### Option C: Netlify
1. https://app.netlify.com → **Add new site → Import existing project**.
2. Build command: empty. Publish directory: `/`.
3. Deploy.

---

## ⚠️ CORS Note
The backend already has `cors()` enabled for all origins, so your deployed frontend
(GitHub Pages/Vercel/Netlify) can call your deployed backend (Render) without issues.

## 🔌 Going Further / Real APIs
Replace mock data in `backend/routes/search.js` with real provider calls:
- **Flights**: Amadeus Self-Service API, Skyscanner Rapid API
- **Hotels**: Booking.com Affiliate API, Amadeus Hotel Search
- **Cabs**: Uber API, Ola API
- **Payments**: Razorpay / Stripe / PayU (add a `/api/payments` route)
- **Database**: swap `lowdb` (`config/db.js`) for PostgreSQL/MongoDB when you need to scale beyond a single-file JSON DB.

---

## 🔒 Security Checklist Before Going Live
- [ ] Set a strong, random `JWT_SECRET` in production (never commit `.env`)
- [ ] Use HTTPS (Render/Vercel/Netlify give this by default)
- [ ] Add rate limiting (e.g. `express-rate-limit`) on auth routes
- [ ] Add input validation/sanitization (e.g. `express-validator`)
- [ ] Move from `db.json` to a real database for production scale
