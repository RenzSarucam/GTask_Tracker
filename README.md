# GAISANO Task Tracker

Internal task tracker for the ICT/R&D team of DSG Son's Group Inc. / GaisanoMalls — assign tasks, monitor workloads, and track progress on a Kanban board.

**Stack:** Laravel 12 (PHP 8.2+) + Inertia.js + React, Tailwind CSS, Framer Motion, @dnd-kit, MySQL 8.

## Features

- Dark, animated login/register with split-screen layout
- Dashboard with live stat cards, due-soon tasks, and a recent-activity feed
- Kanban board with drag-and-drop, persisted server-side
- Task create/edit/delete via modal (title, description, department, priority, status, due date, assignees, progress)
- My Tasks table with search and status/priority filters
- Team page with per-user assigned-task counts and (admin-only) role/position/active-status management
- Positions (job titles) scoped per department, managed from Settings (admin-only)
- Role-based access enforced server-side via Policies — not just hidden in the UI

### Roles

| Role    | Can do |
|---------|--------|
| Admin   | Manage all users (role/active status) and all tasks |
| Manager | Create tasks, assign them, view/update any task, delete tasks they created |
| Staff   | View and update only tasks assigned to them (status + progress only) |

Calendar and Reports are "Coming soon" placeholders for this MVP.

## Local setup (without Docker)

Requires PHP 8.2+, Composer, Node 18+, and a MySQL 8 (or MariaDB) server.

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate
```

Set your database credentials in `.env` (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`), then create the database and run migrations + seeders:

```bash
php artisan migrate --seed
npm run build   # or `npm run dev` during development, in a separate terminal
php artisan serve
```

Visit `http://localhost:8000` and log in with one of the [seeded accounts](#seeded-accounts-localdev-only) below.

## Docker

```bash
cp .env.example .env
php artisan key:generate   # or set APP_KEY manually before first boot
docker compose up --build
```

This runs three containers:
- **app** — PHP-FPM, built from `Dockerfile` (Node stage builds frontend assets, then a PHP 8.3-FPM stage)
- **nginx** — serves the app on `http://localhost:8080` by default (`APP_PORT` in `.env` to change)
- **db** — MySQL 8, with credentials from `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` / `DB_ROOT_PASSWORD` in `.env`

Run migrations/seeders inside the running app container:

```bash
docker compose exec app php artisan migrate --seed --force
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

## Testing

```bash
php artisan test
```

Uses an in-memory SQLite database (configured in `phpunit.xml`), so it never touches your real database.

## Security

- Bcrypt password hashing; strong password policy (12+ chars, mixed case, numbers, symbols; breach check via HaveIBeenPwned in production)
- Login rate limiting (5 attempts/minute per email+IP) with generic error messages (no user enumeration on login or password reset)
- CSRF protection on all forms, session regenerated on login / invalidated on logout
- Security headers middleware: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS (production only)
- Authorization via Laravel Policies on every task/user action — verified with direct API calls that a staff account cannot read, edit, or reassign another user's task, and that non-admins cannot change roles
- Form Request validation and `$fillable`/guarded fields on every model; privileged fields (`role`, `is_active`, etc.) are never mass-assignable
- Activity log for logins, failed logins, logouts, and lockouts
- Email verification required before accessing the app; public registration can be disabled via `REGISTRATION_ENABLED=false`

Run `composer audit` and `npm audit` periodically to check for known dependency vulnerabilities (both clean as of this MVP).

## Deploying to production

1. `composer install --no-dev --optimize-autoloader`
2. `npm ci && npm run build`
3. Set in `.env`:
   - `APP_ENV=production`
   - `APP_DEBUG=false`
   - `APP_URL` to your real HTTPS domain
   - `SESSION_SECURE_COOKIE=true` (requires HTTPS)
   - Real `DB_*` credentials, `APP_KEY` (generate a new one — don't reuse a dev key)
   - `REGISTRATION_ENABLED=false` if new accounts should only be created by an admin
4. `php artisan migrate --force` (add `--seed` only for a fresh environment you want demo data in — don't seed a real production database with these accounts)
5. `php artisan config:cache && php artisan route:cache && php artisan view:cache`
6. Serve over HTTPS — the security headers middleware adds HSTS automatically once `APP_ENV=production`

## Project structure notes

- `app/Policies/` — `TaskPolicy` and `UserPolicy` are the source of truth for who can do what; controllers call `$this->authorize(...)` rather than checking roles inline
- `app/Http/Requests/` — validation lives here, not in controllers; `UpdateTaskRequest` changes its accepted fields based on the requester's role
- `resources/js/Layouts/AuthenticatedLayout.jsx` — persistent app shell (sidebar + topbar); pages register their own topbar search/filter/new-task controls via `useRegisterTopbar` (`resources/js/Contexts/TopbarContext.jsx`), since the layout itself has no access to page-local state
- `resources/js/Components/ui/` — shared design-system primitives (buttons, inputs, checkboxes)
