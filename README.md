# 🦉 Portfolio Backend API

A RESTful backend API powering [Fatiya's Portfolio](https://github.com/fatiya17/portfolio-spotify) — built with **Node.js**, **Express**, and **MongoDB**. Deployed on **Vercel** with **Cloudinary** for image storage.

---

## 📑 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Seeding](#-database-seeding)
- [Image Migration](#-image-migration)
- [Deployment](#-deployment)

---

## 🛠 Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Runtime     | Node.js                           |
| Framework   | Express.js v5                     |
| Database    | MongoDB (via Mongoose v9)         |
| Images      | Cloudinary v2                     |
| Deployment  | Vercel (Serverless)               |

---

## ✨ Features

- **CRUD API** for portfolio content: Projects, Experience, Education, Certificates, and Skills
- **Visitor Analytics** — track visits by IP, country, city, device, platform, and browser
- **Cloudinary Integration** — automatic upload of Base64 images to Cloudinary on create/update
- **Admin Authentication** — password-protected login endpoint
- **Vercel-ready** — serverless connection caching for MongoDB

---

## 📁 Project Structure

```
portfolio-be/
├── models/
│   ├── Certificate.js   # Certificate schema
│   ├── Education.js     # Education schema
│   ├── Experience.js    # Experience schema
│   ├── Project.js       # Project schema (with gallery support)
│   ├── Skill.js         # Skill schema
│   └── Visitor.js       # Visitor/analytics schema
├── index.js             # Main Express app & all route definitions
├── seed.js              # Script to seed the database with sample data
├── migrate_images.js    # Script to migrate Base64 images to Cloudinary
├── vercel.json          # Vercel deployment configuration
├── .env.example         # Example environment variables
└── package.json
```

---

## 📡 API Endpoints

### 🔐 Authentication

| Method | Path         | Description              | Auth Required |
|--------|--------------|--------------------------|---------------|
| POST   | `/api/login` | Validate admin password  | No            |

**Request body:**
```json
{ "password": "your_admin_password" }
```

**Response (success):**
```json
{ "success": true, "token": "..." }
```

---

### 📊 Analytics

| Method | Path             | Description                          | Auth Required |
|--------|------------------|--------------------------------------|---------------|
| POST   | `/api/track`     | Record a visitor event               | No            |
| GET    | `/api/analytics` | Get aggregated analytics data        | No            |

**POST `/api/track` request body:**
```json
{
  "country": "Indonesia",
  "city": "Jakarta",
  "device": "mobile",
  "platform": "Android",
  "browser": "Chrome"
}
```

**GET `/api/analytics` response:**
```json
{
  "totalVisits": 120,
  "uniqueVisitors": 85,
  "topCountries": [
    { "_id": "Indonesia", "count": 60 }
  ],
  "visitsByDate": [
    { "_id": "2025-03-01", "count": 15 }
  ]
}
```

---

### 📂 Projects

| Method | Path                  | Description            |
|--------|-----------------------|------------------------|
| GET    | `/api/projects`       | Get all projects       |
| POST   | `/api/projects`       | Create a new project   |
| PUT    | `/api/projects/:id`   | Update a project       |
| DELETE | `/api/projects/:id`   | Delete a project       |

**Project fields:** `title`, `description`, `category`, `techStack[]`, `problemSolved`, `projectType`, `duration`, `year`, `teamSize`, `imageUrl`, `gallery[{url, caption}]`, `githubLink`, `demoLink`

---

### 💼 Experience

| Method | Path                   | Description              |
|--------|------------------------|--------------------------|
| GET    | `/api/experience`      | Get all experience       |
| POST   | `/api/experience`      | Create an experience     |
| PUT    | `/api/experience/:id`  | Update an experience     |
| DELETE | `/api/experience/:id`  | Delete an experience     |

**Experience fields:** `role`, `company`, `location`, `period`, `type`, `description`, `link`, `skills[]`

---

### 🎓 Education

| Method | Path                  | Description            |
|--------|-----------------------|------------------------|
| GET    | `/api/education`      | Get all education      |
| POST   | `/api/education`      | Create an education    |
| PUT    | `/api/education/:id`  | Update an education    |
| DELETE | `/api/education/:id`  | Delete an education    |

**Education fields:** `degree`, `school`, `year`, `grade`, `link`, `imageUrl`

---

### 🏅 Certificates

| Method | Path                     | Description              |
|--------|--------------------------|--------------------------|
| GET    | `/api/certificates`      | Get all certificates     |
| POST   | `/api/certificates`      | Create a certificate     |
| PUT    | `/api/certificates/:id`  | Update a certificate     |
| DELETE | `/api/certificates/:id`  | Delete a certificate     |

**Certificate fields:** `title`, `issuer`, `date`, `credentialId`, `verifyLink`, `description`, `imageUrl`, `category`

---

### 🧰 Skills

| Method | Path              | Description        |
|--------|-------------------|--------------------|
| GET    | `/api/skills`     | Get all skills     |
| POST   | `/api/skills`     | Create a skill     |
| PUT    | `/api/skills/:id` | Update a skill     |
| DELETE | `/api/skills/:id` | Delete a skill     |

**Skill fields:** `category`, `color`, `bg`, `iconName`, `items[{name, iconKey, color}]`

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)
- [Cloudinary](https://cloudinary.com/) account

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/fatiya17/portfolio-be.git
cd portfolio-be

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your actual values

# 4. Start the development server
npm run dev
```

The server will start at `http://localhost:5000`.

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

| Variable                 | Description                                      |
|--------------------------|--------------------------------------------------|
| `MONGO_URI`              | MongoDB connection string (Atlas or local)       |
| `CLOUDINARY_CLOUD_NAME`  | Your Cloudinary cloud name                       |
| `CLOUDINARY_API_KEY`     | Your Cloudinary API key                          |
| `CLOUDINARY_API_SECRET`  | Your Cloudinary API secret                       |
| `ADMIN_PASSWORD`         | Password used to authenticate admin actions      |
| `PORT`                   | Server port (default: `5000`)                    |

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## 🌱 Database Seeding

Populate the database with sample data:

```bash
node seed.js
```

This will clear existing data and insert sample Projects, Experience, Education, Certificates, and Skills.

---

## 🖼 Image Migration

If you have existing records with Base64-encoded images in the database, run the migration script to upload them to Cloudinary:

```bash
node migrate_images.js
```

This script processes Projects and Certificates, replacing Base64 strings with Cloudinary URLs.

---

## ☁️ Deployment

This project is configured for **Vercel** serverless deployment via `vercel.json`.

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel --prod
```

Set all environment variables in your [Vercel project settings](https://vercel.com/docs/environment-variables) before deploying.

---

## 📝 License

This project is open source and available under the [ISC License](./LICENSE).
