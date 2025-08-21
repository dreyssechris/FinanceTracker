# FinanceTracker – Project Roadmap

This project serves both as a practical personal finance tracker and as a learning journey:  
from building a usable monolithic ASP.NET Core + React application, to improving it iteratively, and eventually transitioning into a microservice architecture.

---
## Version 1.0 – Usable Monolith (in progress)
**Goal:** A fully usable version of the FinanceTracker, deployed on the Raspberry Pi and running in production.

- [x] Backend (ASP.NET Core 8)
  - REST API (`/api/categories`, `/api/transactions`).
  - PostgreSQL with EF Core Migrations.
- [x] Docker Setup
  - `docker-compose.yml` with API, DB, and pgAdmin.
- [x] Frontend (React + Vite + TypeScript)
  - CRUD UI for Categories and Transactions.
  - Service layer (`categoryService.ts`, `transactionService.ts`).
- [ ] Deployment
  - Run Monolith + Frontend + DB stack on Raspberry Pi with Docker.
  - Expose via Caddy reverse proxy (port 80/443).
- [ ] Documentation
  - README with usage guide.
  - Setup instructions for Pi deployment.

Outcome: First stable release (v1.0) – application can be used productively to track finances.

---
## Version 1.1 – Improvements & Hardening (planned)
**Goal:** Improve the running monolith while keeping it usable.

- [ ] Backend Improvements
  - Clean Architecture layering (`Domain`, `Application`, `Infrastructure`, `Api`).
  - Better error handling & validation middleware.
  - Logging (Serilog).
- [ ] Frontend Improvements
  - Improved UI/UX (filters, lists, validation).
  - Optional state management (React Query).
- [ ] Security
  - Configure HTTPS (Caddy + certificates).
  - Secure `.env` handling for DB credentials.
- [ ] Testing
  - Unit tests (xUnit for backend, Vitest/Jest for frontend).
- [ ] Documentation
  - Updated architecture diagrams.
  - User Guide.

Outcome: Refined version (v1.1) – still a monolith, but more polished and closer to production-grade quality.

---
## Version 2.0 – First Microservice Extraction (planned)
**Goal:** Start decoupling the monolith into microservices.

- Extract Categories into its own service with its own database.
- Introduce API Gateway (Caddy/Traefik).
- Keep frontend unchanged (consumes via `/api/...`).

---
## Version 3.0 – Expanding Services (planned)
**Goal:** Introduce additional microservices and asynchronous communication.

- Transactions -> own service.
- Event bus (RabbitMQ/Redis).
- Outbox pattern.

---
## Version 4.0 – Security & Deployment (planned)
**Goal:** Harden system for long-term production.

- Authentication (OpenID Connect, Keycloak).
- CI/CD (GitHub Actions).
- Monitoring (Prometheus, Grafana, Loki).
- Optimized Docker setup for Raspberry Pi.

---
# Learning Goals
- Deliver a real, usable application early (v1.0).
- Learn iterative refinement and hardening (v1.1).
- Transition into microservices gradually (v2.0+).
- Gain experience in security, deployment and observability.

---
Each version delivers a working release.  
The application is usable from v1.0 onward, while later versions focus on architecture, scalability, and professional practices.