# 📋 Release Notes — Portfolio Backend API

> Backend API for **Fatiya's Portfolio** — built with Node.js, Express, and MongoDB.

---

## [v1.0.0] — Initial Release

### ✨ Features

#### 🔐 Admin Authentication
- `POST /api/login` — Password-protected endpoint that validates the `ADMIN_PASSWORD` environment variable and returns an admin token.

#### 📊 Visitor Analytics
- `POST /api/track` — Records visitor events including IP address, country, city, device type, platform (OS), and browser.
- `GET /api/analytics` — Returns aggregated analytics:
  - Total visits
  - Unique visitors (by distinct IP)
  - Top 5 countries by visit count
  - Daily visit counts for the last 7 days (for charting)

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

### 🖼 Image Handling
- **Cloudinary integration** — All image fields (`imageUrl`, gallery `url`) are automatically uploaded to Cloudinary when a Base64 data URI is provided. Existing URLs are passed through unchanged.
- **Image migration script** (`migrate_images.js`) — Utility script to upload existing Base64-encoded images in MongoDB to Cloudinary and replace them with secure URLs.
- **50 MB request body limit** — Supports large Base64 image payloads.

### 🛠 Tech Stack
| Layer       | Technology             |
|-------------|------------------------|
| Runtime     | Node.js v18+           |
| Framework   | Express.js v5          |
| Database    | MongoDB (Mongoose v9)  |
| Images      | Cloudinary v2          |
| Deployment  | Vercel (Serverless)    |

### ⚙️ Infrastructure
- **Vercel deployment** (`vercel.json`) — Serverless deployment configuration with proper rewrites.
- **MongoDB connection caching** — Avoids creating a new connection on every serverless function invocation, reducing cold-start latency.
- **CORS** — Enabled with credentials support for frontend integration.
- **Database seeding script** (`seed.js`) — Utility script to populate the database with sample data for all resources.
- **Health-check route** (`GET /`) — Returns a confirmation message that the backend is running.

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
