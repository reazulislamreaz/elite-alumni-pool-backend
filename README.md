# TaskForge — Smart Project & Task Collaboration System

A full-stack MERN application for managing projects, tasks, team members, and
work progress — with role-based access control, business-rule validation, and
analytics. **This repository is the backend (REST API).**

## 🔗 Live & Source

| | |
|---|---|
| **Live App** | https://elite-alumni-pool-frontend.vercel.app |
| **Live API** | https://elite-alumni-pool-backend.vercel.app |
| **Frontend repo** | https://github.com/reazulislamreaz/elite-alumni-pool-frontend |
| **Backend repo** | https://github.com/reazulislamreaz/elite-alumni-pool-backend |

## 🔑 Demo Credentials

One-click demo cards are on the login page. Password for all demo accounts: **`Demo@123456`**

| Role | Email |
|------|-------|
| Admin | `admin@demo.elitepool.com` |
| Project Manager | `manager@demo.elitepool.com` |
| Team Member | `member@demo.elitepool.com` |

> Demo users are auto-seeded when the API starts. Public signup always creates a
> **Team Member** — Admin/Manager are privileged roles assigned internally.

## ✨ Features

- **Auth & RBAC** — email/password, JWT, demo login, three roles (Admin, Project Manager, Team Member)
- **Projects** — full CRUD, status (Active / Completed / On Hold), deadline, members
- **Tasks** — CRUD, assignee, priority, status, quick status change, bulk actions, progress indicators
- **Validation** — duplicate-title block, no reassigning completed tasks, no past deadlines (timezone-safe)
- **Collaboration** — add project members, assign tasks (members only), member-wise lists, workload summary
- **Dashboard** — KPI cards + charts (priority, status, progress, productivity), recent activity, upcoming deadlines, high-priority, workload
- **Activity log**, **comments**, **file attachments**, **notifications**
- **Search / filter / sort / pagination**, **dark & light mode**, fully **responsive** (mobile drawer nav)

## 🛠 Tech Stack

- **Backend:** Node.js, Express 5, TypeScript, Mongoose, Zod, JWT, bcrypt
- **Database:** MongoDB (Atlas)
- **Frontend:** React 19, Vite, TypeScript, React Query, Zustand, Recharts (separate repo)

## 🚀 Setup

```bash
cp .env.example .env      # fill in real values
npm install
npm run dev               # http://localhost:5000
```

Scripts: `npm run dev` (tsx watch) · `npm run build` (tsc) · `npm start` (node dist) · `npm test` (jest).

## 🔐 Environment Variables (`.env`)

| Key | Description |
|-----|-------------|
| `PORT` | API port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `CLIENT_URL` | Frontend origin for CORS (e.g. the Vercel app URL) |
| `DEMO_PASSWORD` | Password for the seeded demo accounts |

## 📡 API Overview

- `POST /api/auth/signup` · `/login` · `/demo-login` · `GET /api/auth/me`
- `GET/POST/PATCH/DELETE /api/projects` · `POST /api/projects/:id/members`
- `GET/POST/PATCH/DELETE /api/tasks` · `PATCH /api/tasks/bulk`
- `GET /api/dashboard/kpis` · `/analytics` · `/workload`
- `GET /api/collaboration/activities` · `/notifications`
- `POST /api/collaboration/tasks/:id/comments` · `/attachments`

## 👤 Role Permissions

- **Admin** — full access
- **Project Manager** — create/manage projects, assign tasks, add members
- **Team Member** — update status on tasks assigned to them only

## ✅ Validation Rules

- Duplicate task titles in a project → *"This task already exists in the project."*
- Reassigning a completed task → *"Completed tasks cannot be reassigned."*
- Past deadline → *"Please select a valid deadline."*

## ☁️ Deployment (Vercel — serverless)

The Express app is exported as a serverless handler (`src/serverless.ts`) and
routed via `vercel.json`. To deploy:

1. Import this repo into Vercel (framework preset: **Other**).
2. Set env vars: `MONGO_URI`, `JWT_SECRET`, `DEMO_PASSWORD`, and `CLIENT_URL`
   (the frontend URL, for CORS).
3. Deploy. Verify `https://<your-api>/health` returns `{"ok":true}`.
4. Ensure MongoDB Atlas Network Access allows the connection.

## 🧪 Test & Build

```bash
npm test
npm run build
```

## Notes

- Attachments currently store metadata with placeholder URLs (swap for S3/Cloudinary for real hosting).
- Notifications are persisted (not yet realtime websockets).
