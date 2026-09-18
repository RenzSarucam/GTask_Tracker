# GAISANO Task Tracker

Internal task tracker for the ICT/R&D team of DSG Son's Group Inc. / GaisanoMalls — assign tasks, monitor workloads, and track progress on a Kanban board.

**Stack:** Laravel 12 + Inertia.js + React, Tailwind CSS, Framer Motion, MySQL 8.

## Local setup

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate
```

Set your database credentials in `.env` (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`), then:

```bash
php artisan migrate --seed
npm run build   # or `npm run dev` during development
php artisan serve
```

## Seeded accounts (local/dev only)

Running `php artisan migrate --seed` creates one account per role, all in the ICT / R&D department, sharing the password below.

| Role    | Email                 | Password           |
|---------|------------------------|---------------------|
| Admin   | admin@gaisano.local     | `GaisanoDemo#2025`  |
| Manager | manager@gaisano.local   | `GaisanoDemo#2025`  |
| Staff   | staff1@gaisano.local    | `GaisanoDemo#2025`  |
| Staff   | staff2@gaisano.local    | `GaisanoDemo#2025`  |
| Staff   | staff3@gaisano.local    | `GaisanoDemo#2025`  |

These are seed data for local development and demos only — change or remove them before any shared/production deployment.

## Docker

```bash
docker compose up --build
```

Runs the app behind nginx (port `8080` by default) with a MySQL 8 container. See `docker-compose.yml` for the configurable ports/credentials.
