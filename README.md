# JobBoard — Job Application Tracker

JobBoard is a full-stack web application that helps job seekers organize and stay on top of their job search. Instead of tracking applications in a spreadsheet, users log each application, get automatically reminded when a follow-up is due, and see real analytics on how their search is actually going.

**Live app:** https://jobboard-bo9o.vercel.app (main link — use this to interact with the application)
**Backend API:** https://jobboard-drab.vercel.app *(API only — visiting it directly in a browser returns a 401, since it requires an auth token; use the live app link above to interact with it)*
**Repository:** https://github.com/syal123/jobboard

## Business Value

Job hunting is disorganized by default — applications get forgotten, follow-ups slip, and it's hard to tell if your approach is actually working. JobBoard solves this directly:

- **Never miss a follow-up.** Every application can have a follow-up date; the app surfaces a clear banner the moment one is due or overdue, instead of relying on the user to remember.
- **See what's actually working.** The dashboard computes response rate, interview rate, and offer rate from real application data, turning a list of applications into an honest signal about search effectiveness.
- **Avoid duplicate effort.** The app warns before you log a second application to a company/role you've already applied to.
- **A full history, not just a snapshot.** Edits and deletions are tracked (not just overwritten or silently discarded), so the dashboard can show *what changed*, not only *what exists right now*.

This is a personal job-application tracker (each user manages their own applications) — not a public two-sided marketplace where companies post listings for many candidates to browse.

## Features

- User registration and login secured with JWT authentication and BCrypt password hashing.
- Create, edit, delete, search, filter, and sort job applications.
- Status tracking (Applied / Ongoing / Interview / Offer / Rejected) with color-coded badges.
- Automatic due/overdue follow-up reminders shown on the Jobs page.
- Dashboard with application counts by status, response/interview/offer rate, upcoming follow-ups, and drill-down lists for edited and deleted applications.
- Duplicate-application detection.
- CSV export of the current (filtered) job list.
- Automatic retry on transient network failures, so a slow backend cold-start doesn't surface as a false "failed" error to the user.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, React Router, Recharts, Axios |
| Backend | Java 17, Spring Boot 4, Spring Data JPA, Spring Security (crypto), JWT (jjwt) |
| Database | MySQL (hosted on Aiven) |
| Deployment | Vercel (frontend as a static site, backend as a Docker container Function) |
| CI/CD | GitHub Actions |

## Architecture

```
┌─────────────────┐        HTTPS/JSON        ┌──────────────────┐        JDBC/SSL        ┌──────────────┐
│  React frontend │  ───────────────────────▶ │  Spring Boot API │ ──────────────────────▶ │  MySQL (Aiven) │
│  (Vercel static) │ ◀─────────────────────── │  (Vercel Docker) │ ◀────────────────────── │              │
└─────────────────┘                           └──────────────────┘                        └──────────────┘
```

- The frontend and backend are deployed as two **separate Vercel projects**, connected via the `VITE_API_URL` environment variable (frontend) and `CORS_ALLOWED_ORIGINS` (backend).
- The backend runs as a Docker container (`backend/Dockerfile.vercel`) on Vercel's container-image Functions, since Spring Boot doesn't fit Vercel's native Node.js serverless model.
- Authentication is stateless JWT: the token is issued on login and sent as a `Bearer` header on every subsequent request; a custom `JwtAuthFilter` validates it per-request.

### Backend project layout

```
backend/src/main/java/com/jobboard/backend/
├── controller/     REST endpoints (auth, jobs, dashboard)
├── service/        Business logic
├── model/          JPA entities (User, Job, DeletedJob)
├── repository/     Spring Data JPA repositories
├── filter/         JWT authentication filter
├── config/         CORS configuration
├── util/           JWT signing/verification
└── exception/      Business exceptions + global error handling
```

### Frontend project layout

```
frontend/src/
├── pages/          Register, Login, Jobs, Dashboard
├── api/            Axios client with auth header + retry logic
└── components/     Shared layout (sidebar navigation)
```

## Running Locally

### Backend

Requires Java 17 and a MySQL database (or point it at any reachable MySQL instance).

```bash
cd backend
DB_URL="jdbc:mysql://localhost:3306/jobboard" \
DB_USER="root" \
DB_PASSWORD="yourpassword" \
JWT_SECRET="a-long-random-secret" \
./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`.

### Frontend

Requires Node 22+.

```bash
cd frontend
npm install
npm run dev
```

The app starts on `http://localhost:5173` and talks to the backend at `http://localhost:8080/api` by default (override with a `.env` file setting `VITE_API_URL`).

### Running backend tests

```bash
cd backend
./mvnw clean test
```

## CI/CD Pipeline

Defined in `.github/workflows/ci.yml`, triggered on every push and pull request to `main`:

1. **`backend_test`** — sets up JDK 17 and runs the Maven test suite (using an in-memory H2 database, no external dependencies needed).
2. **`frontend-build`** — sets up Node and runs the Vite production build to catch type errors and build failures early.
3. **`deploy-backend`** — on a push to `main`, after tests pass, installs the Vercel CLI and deploys the backend container image straight to Vercel production.
4. **`deploy-frontend`** — on a push to `main`, after the build succeeds, pulls the Vercel environment, builds the frontend for Vercel, and deploys it to production.

Deployment credentials (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID_BACKEND`, `VERCEL_PROJECT_ID_FRONTEND`) are stored as GitHub Actions secrets, never committed to the repository.

## Environment Variables

**Backend** (set in the Vercel project's Environment Variables, and/or locally):

| Variable | Purpose |
|---|---|
| `DB_URL`, `DB_USER`, `DB_PASSWORD` | MySQL connection |
| `JWT_SECRET` | Signs and verifies auth tokens |
| `PORT` | Port the app listens on (Vercel injects this) |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of frontend origins allowed to call the API |

**Frontend** (set in the Vercel project's Environment Variables):

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the deployed backend API |

## Notable Engineering Decisions

- **Cold-start tuning:** the backend runs on Vercel's container-image Functions, which enforce a 15-second startup window before giving up on a cold instance. Spring Boot's JVM startup was tuned significantly (JVM flags, removing unused dependencies, skipping eager Hibernate metadata inspection, non-blocking entropy source for password hashing) to reliably fit inside that window.
- **Frontend retry logic:** requests that fail during a cold start — whether the connection drops entirely with no response, or Vercel returns its own platform-level error (500/502/503/504) because the container didn't wake up in time — are automatically retried a few times before surfacing an error, rather than showing a false failure to the user.
- **Business vs. system errors:** expected failures (duplicate username, wrong credentials, job not found) are raised as a dedicated `BusinessException` and mapped to a clean 400 response with the real message — instead of an opaque 500 error and a misleading stack trace in the logs.

## How AI was used
This project was built using AI (Claude code) as a hands-on collaborator throughout the development process:

- **Feature design and implementation** - planning and building the core tracker (jobs CRUD, JWT auth) as well as the business-value features layered on top (follow-up reminders, dashboard analytics, duplicate detection, search/filter, CSV export, edit/delete history).
- **Deployment troubleshooting** - diagnosing and fixing a series of real Vercel deployment issues (port configuration, JVM cold-start timeouts, CORS, SPA routing) through iterative debugging against actual runtime logs and errors.
- **CI/CD pipeline** - designing the GitHub Actions workflow that tests and deploys both the frontend and backend to Vercel automatically.
- **Documentation** - drafting this README.

All AI-assisted code was reviewed, tested against real deployments, and understood before being committed - including a pass where the codebase's key files were manually annotated with explanatory comments to reinforce that understanding.

## Known Limitations

- This is a single-user-per-account tracker, not a multi-tenant job marketplace.
- Analytics are computed live on each dashboard load rather than cached or aggregated in a separate reporting store.
- The backend can still experience an occasional slow first response after being idle, due to inherent JVM startup time on a serverless platform.
