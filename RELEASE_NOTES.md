# 📋 Release Notes — Portfolio Backend API

> Backend API for **Fatiya's Portfolio** — built with Node.js, Express, and MongoDB.

---

## [v1.5.0] — Schema & Field Enhancements

### ✨ New Features
- **Certificate category field** — Certificates now include a `category` field (defaults to `"Others"`) enabling filtering and grouping in the frontend.
- **Experience link field** — Experience entries now support an optional `link` field for referencing company profiles or project pages.
- **Education link field** — Education entries now support an optional `link` field for institutional websites or credential verification pages.

---

## [v1.4.0] — Stability, Deployment & Image Support

### ✨ New Features
- **Education image upload** — Education entries now support `imageUrl` with automatic Base64 → Cloudinary upload on create and update.

### 🔧 Fixes & Improvements
- Fixed Express routing error for catch-all `/.*/` wildcard route causing issues on Vercel.
- Fixed Vercel deployment error that occurred after the education image update.
- Removed debug `console.log` messages from production code.
- Updated server configuration to support deployment on Google Cloud Run in addition to Vercel.

---

## [v1.3.0] — Visitor Analytics

### ✨ New Features
- **Visitor tracking** (`POST /api/track`) — Records visitor events including IP address, country, city, device type, platform (OS), and browser.
- **Analytics dashboard** (`GET /api/analytics`) — Returns aggregated analytics:
  - Total visits
  - Unique visitors (by distinct IP)
  - Top 5 countries by visit count
  - Daily visit counts for the last 7 days (for charting)
- Added `Visitor` Mongoose model with `ip`, `country`, `city`, `device`, `platform`, `browser`, and `timestamp` fields.

---

## [v1.2.0] — Cloudinary Image Integration & Vercel Optimisation

### ✨ New Features
- **Cloudinary image upload** — All image fields (`imageUrl`, gallery `url`) are now automatically uploaded to Cloudinary when a Base64 data URI is provided. Existing URLs are passed through unchanged.
- **Image migration script** (`migrate_images.js`) — Utility script to retroactively upload existing Base64-encoded images in MongoDB to Cloudinary and replace them with secure URLs.
- **Database seeding script** (`seed.js`) — Utility script to populate the database with sample data for Projects, Experience, Education, Certificates, and Skills.

### 🔧 Fixes & Improvements
- Serverless MongoDB connection caching for Vercel — avoids creating a new connection on every function invocation, reducing cold-start latency.
- Added 50 MB request body size limit (`express.json` and `urlencoded`) to support large Base64 image payloads.

---

## [v1.1.0] — Authentication, Gallery & Vercel Deployment

### ✨ New Features
- **Admin authentication** (`POST /api/login`) — Password-protected endpoint that validates the `ADMIN_PASSWORD` environment variable and returns an admin token.
- **Project gallery support** — Projects now support a `gallery` array of `{ url, caption }` objects for multi-image showcasing.
- **Certificate image upload** — Certificates now include an `imageUrl` field uploaded to Cloudinary.
- **Vercel deployment configuration** (`vercel.json`) — Serverless deployment support with proper rewrites.
- **Live health-check route** (`GET /`) — Returns a confirmation message that the backend is running.
- **CORS configuration** — Wide-open CORS with credentials support for frontend integration.

---

## [v1.0.0] — Initial Release

### ✨ New Features

Full RESTful CRUD API for all portfolio content types:

#### 📂 Projects (`/api/projects`)
- `GET` — List all projects (newest first)
- `POST` — Create a project
- `PUT /:id` — Update a project
- `DELETE /:id` — Delete a project

**Schema:** `title`, `description`, `category`, `techStack[]`, `problemSolved`, `projectType`, `duration`, `year`, `teamSize`, `imageUrl`, `gallery[{url, caption}]`, `githubLink`, `demoLink`

#### 💼 Experience (`/api/experience`)
- Full CRUD operations
- **Schema:** `role`, `company`, `location`, `period`, `type`, `description`, `link`, `skills[]`

#### 🎓 Education (`/api/education`)
- Full CRUD operations
- **Schema:** `degree`, `school`, `year`, `grade`, `link`, `imageUrl`

#### 🏅 Certificates (`/api/certificates`)
- Full CRUD operations
- **Schema:** `title`, `issuer`, `date`, `credentialId`, `verifyLink`, `description`, `imageUrl`, `category`

#### 🧰 Skills (`/api/skills`)
- Full CRUD operations
- **Schema:** `category`, `color`, `bg`, `iconName`, `items[{name, iconKey, color}]`

### 🛠 Tech Stack
| Layer       | Technology             |
|-------------|------------------------|
| Runtime     | Node.js v18+           |
| Framework   | Express.js v5          |
| Database    | MongoDB (Mongoose v9)  |
| Images      | Cloudinary v2          |
| Deployment  | Vercel (Serverless)    |

---

## Environment Variables

| Variable                | Description                                      |
|-------------------------|--------------------------------------------------|
| `MONGO_URI`             | MongoDB connection string (Atlas or local)       |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name                       |
| `CLOUDINARY_API_KEY`    | Your Cloudinary API key                          |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret                       |
| `ADMIN_PASSWORD`        | Password used to authenticate admin actions      |
| `PORT`                  | Server port (default: `5000`)                    |

---

*Generated for [portfolio-be](https://github.com/fatiya17/portfolio-be)*
