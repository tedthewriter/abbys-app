# Abby’s App

Separate mobile-first support app for Abby. This repository contains no personal content from the other app and no shared credentials. GitHub Pages serves public static code; private entries and progress require sign-in and row-level security in a separate Supabase project.

## Status

- Six home destinations in the requested order, including the two workbooks.
- The seven CBT week labels and 24 self-love reading slots have private completion tracking. Original lesson material has **not** been imported yet.
- The flat 10-card Skills library and mindfulness cards currently contain short **provisional** instructions. Confirm and import the previously reviewed wording before release.
- Private Goals & Vision and Ideals entries can be added and removed. Ideals image storage is reserved for a future update.
- No account creation in the public app. Create users or issue invitations in the dedicated Supabase dashboard.

## Local setup

1. Create a **new** Supabase project in the selected organization. Run `supabase/migrations/20260929022030_initial_private_schema.sql` only there.
2. Disable public self-signup in that project's Auth settings and configure its site URL / redirect URLs for the separate Pages URL. Create Abby’s own account there.
3. Copy `.env.example` to `.env` and enter only that project's URL and publishable key. Never use a secret/service-role key in the browser. `.env` is ignored. The Pages workflow includes only this project's public URL and publishable key.
4. `npm ci`, `npm run dev`, `npm run build`.
5. For a project Pages repository named `REPO`, build with `PAGES_BASE=/REPO/ npm run build` and publish `dist`. The committed workflow can be added once the repository name is fixed.

The source code must not contain the purchased workbooks, private notes, or personal images. The current workbook screens are structure and progress only, pending a reviewed content import.
