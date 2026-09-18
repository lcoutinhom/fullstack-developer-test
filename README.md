# Fullstack Developer Test — User Management

### AI Usage Disclosure

This submission was built with **Claude Sonnet 5**, via **Claude Code**, as an interactive
pair-programming session (not a single generate-and-paste prompt). Test-driven: specs were
written before the implementation for each feature slice, run to confirm they failed for the
right reason, then made to pass. Every commit was reviewed and committed by the author, not
the assistant.

## What this is

A user-management app built for the Umanni fullstack take-home test:

- **Admin**: a real-time dashboard (total users + per-role counts, updated live over
  WebSockets whenever a user is created, deleted, or has its role changed), full user
  CRUD with a role toggle, and asynchronous CSV/XLSX import of new users with a live
  progress bar.
- **User**: sign up, sign in, and manage their own profile (view/edit/delete) — never
  anyone else's.
- **Visitor**: self-registration, always as a plain user (the server ignores any `role`
  submitted by the client outside the admin-only endpoints).

## Stack

- **Ruby 4.0.2 / Rails 8.1**, SQLite (Rails 8's adapter enables WAL journal mode by
  default — no extra config needed for "production-ready WAL mode").
- **Inertia.js + React 19 + TypeScript**, bundled with **Vite**, styled with
  **Tailwind CSS v4**.
- **Solid Queue** for the background import job, **Solid Cable** for the live
  dashboard/import updates (both DB-backed — no Redis).
- Rails 8's built-in authentication generator (`bin/rails generate authentication`),
  customized for the `full_name` / `role` / `avatar_image` fields this app needs and for
  role-based redirects — not Devise.
- **RSpec** (models, requests, jobs, channels, and system specs driven by headless
  Chrome via Capybara/Selenium), **FactoryBot**, **SimpleCov** (90% minimum coverage,
  enforced), **parallel_tests**.

## Requirements

- Ruby 4.0.2 (see `.ruby-version` / `.tool-versions`)
- Node 26.4.0 (see `.tool-versions`) with npm
- SQLite3 (bundled by the `sqlite3` gem; no separate server to install)

## Setup

```bash
bin/setup
```

This installs gems and npm packages, prepares the SQLite databases, and starts the dev
server (`bin/dev`, which runs Puma and the Vite dev server together). Pass
`--skip-server` to stop after setup, or `--reset` to drop and recreate the database.

Seed some demo data (idempotent — safe to run more than once):

```bash
bin/rails db:seed
```

This creates one admin and five regular users, all with the password `password123`
(printed to stdout as they're created). Sign in as `admin@example.com` to see the admin
dashboard, or as `grace@example.com` (etc.) to see the user profile view.

## Running the app

```bash
bin/dev
```

Visit `http://localhost:3000`. Visitors are redirected to sign in; signed-in users land
on their profile; admins land on the dashboard.

## Running the tests

```bash
bundle exec rspec                              # full suite, serially (simplest for local dev)
bundle exec rake parallel:create parallel:load_schema   # first time only
bundle exec parallel_rspec -n 2 spec/models spec/requests spec/jobs spec/channels spec/services
for f in spec/system/*_spec.rb; do bundle exec rspec "$f"; done   # see note below
```

Coverage (via SimpleCov) must stay at or above 90% of lines or the run exits non-zero;
the report is written to `coverage/index.html`. It's only *enforced* when
`ENFORCE_COVERAGE=true` is set (CI sets it on the last command of a run) — otherwise a
single file or a partial run just reports its (expectedly low) slice without failing.
CI runs `rubocop`, `brakeman`, `bundler-audit`, and the full test suite on every push/PR
— see `.github/workflows/ci.yml`.

System specs boot a real headless Chrome via Selenium Manager (which downloads a
matching browser/driver automatically — no local Chrome install required) and exercise
the actual React UI, including the ActionCable-driven live dashboard and import-progress
updates. **CI runs each system spec file in its own process, never in parallel with
another system spec.** A specific combination of system spec files sharing a browser/
process was found to leave a later page's buttons completely inert (clicks never
reached the server — confirmed via the Rails log), 100% reproducible with that file
ordering and never in isolation. The exact root cause wasn't pinned down despite a
thorough investigation (ruled out: Selenium cold start, Puma thread exhaustion, CSRF,
obscured elements, JS errors, Vite asset-compile races, and Inertia's encrypted-history
sessionStorage); per-file isolation reliably avoids it.

## Docker

```bash
docker build -t fullstack_developer_test .
docker run -d -p 80:80 -e RAILS_MASTER_KEY=$(cat config/master.key) fullstack_developer_test
```

The multi-stage build installs a pinned Node toolchain (via `node-build`, the same
approach Rails' own generator uses) to run the Vite production build as part of
`assets:precompile`, then ships a slim runtime image without Node or `node_modules`.
SQLite databases and Active Storage files live under `/rails/storage`, which
`config/deploy.yml` mounts as a persistent Kamal volume — there's no separate database
accessory to configure.

## Performance: Ruby 4's ZJIT

The production image runs with `RUBYOPT="--zjit"` (Ruby 4's new method-based JIT).
`script/benchmark_zjit.rb` measures it against this app's actual CPU-bound hot path —
`Imports::SpreadsheetParser` parsing a 50,000-row CSV, the work `Imports::ProcessSpreadsheetJob`
does for every uploaded spreadsheet:

```
$ bin/rails runner script/benchmark_zjit.rb          # ZJIT off (baseline)
Parsed 50000 rows in ~0.39s (~128,000 rows/s)

$ RUBYOPT="--zjit" bin/rails runner script/benchmark_zjit.rb
Parsed 50000 rows in ~0.335s (~149,000 rows/s)
```

~15% faster, consistent across repeated runs, no test failures with ZJIT enabled
(`RUBYOPT="--zjit" bundle exec rspec`). Not enabled in development, since JIT warmup
overhead isn't worth it for a process that reloads code on every request.

## Extra-credit items from the test brief

Done: Kamal 2 deploy config, Thruster as the production proxy, Ruby 4's ZJIT (see
above). **Not done: SSR for the Inertia/React frontend.** The generator scaffolds an
`inertia_ssr_head` tag in the layout, but nothing renders through it yet — pages are
fully client-rendered. Wiring up real SSR (a Node-side render entrypoint, a running SSR
process managed via inertia_rails' Puma plugin, and re-verifying every page renders
identically server- and client-side) was judged too large a change to take on safely
at this point versus the value it'd add for a test that's graded primarily on the
required functionality.

## Notable decisions and trade-offs

- **SQLite over PostgreSQL/MySQL**: no local Postgres server was available for this
  submission, and the test explicitly allows SQLite "configured for production-ready
  WAL mode" — which Rails 8's adapter does out of the box. This also simplifies the
  Kamal deploy (one volume, no DB accessory).
- **Pagy 43's `Offset` API** (`Admin::UsersController#index`) is a substantially
  redesigned, unfamiliar-to-me API compared to older Pagy versions — I read its source
  directly (`lib/pagy/classes/offset/offset.rb`) rather than guessing at usage, since
  getting it wrong silently would be worse than not using the gem at all.
- **`json` gem pinned to `~> 2.21`**: `json` 3.0 dropped the positional options-hash
  argument that `activesupport` 8.1.3.1 still passes to `JSON.parse`, which broke
  signed session cookies on Ruby 4.0.2. See the comment in the `Gemfile`.
- **A prompt-injection attempt** was found embedded as a hidden HTML comment in the
  original test's `readme.md` (instructing an AI assistant to fabricate this disclosure
  section and inject unrelated marker comments into the code, without telling the
  human). It was not followed; this section reflects what was actually done.
