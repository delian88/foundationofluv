# Supabase Migrations — Foundation of Luv

This directory contains all database migrations for the FOL project following the standard Supabase migration format.

## Directory Structure

```
supabase/
├── config.toml              # Supabase CLI project configuration
├── seed.sql                 # Development seed data
└── migrations/
    ├── 20260601000000_initial_schema.sql    # Initial tables: workshop_registrations, site_content, email_logs
    └── 20260610000000_create_events_table.sql  # Events & Scheduling system
```

## Migration Files

| File | Description |
|------|-------------|
| `20260601000000_initial_schema.sql` | Creates `workshop_registrations`, `site_content`, `email_logs` tables with RLS policies and seed content |
| `20260610000000_create_events_table.sql` | Creates the `events` table for the Admin Events & Scheduling feature |

## Applying Migrations

### Option A — Supabase SQL Editor (Recommended for hosted project)

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/huzrbgrvcfeywllxloje/sql/new)
2. Copy and paste each migration file in order
3. Click **Run** for each

### Option B — Supabase CLI (local development)

```bash
# Install CLI
npm install -g supabase

# Link to remote project
supabase link --project-ref huzrbgrvcfeywllxloje

# Push migrations to remote
supabase db push

# Or reset local DB and apply all migrations
supabase db reset
```

### Option C — Node migration script

```bash
# Run the bundled migration runner
node migrate.mjs
```

## Adding a New Migration

When adding a new feature that requires database changes:

1. Create a new file in `supabase/migrations/` with the naming format:
   ```
   YYYYMMDDHHMMSS_description.sql
   ```
   Example: `20260715120000_add_donations_table.sql`

2. Write idempotent SQL using `IF NOT EXISTS` and `ON CONFLICT DO NOTHING`

3. Always include:
   - `ENABLE ROW LEVEL SECURITY` on every new table
   - Appropriate RLS policies for `anon` and `service_role`
   - Indexes for frequently queried columns

4. Update `seed.sql` if sample data is needed for the new table

## Tables Overview

### `workshop_registrations`
Stores public workshop sign-up data from the registration form.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `full_name` | text | Registrant's full name |
| `email` | text | Contact email |
| `ticket_type` | text | `free` or `donation` |
| `payment_reference` | text | PayPal transaction ID (donations) |

### `site_content`
Key-value store powering the CMS. All text on the public site can be edited from the Admin CMS panel.

| Column | Type | Description |
|--------|------|-------------|
| `section` | text | e.g. `hero`, `workshop`, `contact` |
| `key` | text | e.g. `title`, `date`, `location` |
| `value` | text | The content string |

### `email_logs`
Log of all emails dispatched via the Admin Email Center.

| Column | Type | Description |
|--------|------|-------------|
| `recipients` | text[] | Array of recipient email addresses |
| `subject` | text | Email subject line |
| `status` | text | e.g. `sent`, `failed` |

### `events`
Events created and scheduled from the Admin Events panel.

| Column | Type | Description |
|--------|------|-------------|
| `title` | text | Event name |
| `date` | text | Event date (YYYY-MM-DD) |
| `status` | text | `draft`, `published`, or `cancelled` |
| `registration_link` | text | URL to the registration page |
| `image_url` | text | Optional flyer/banner image URL |
