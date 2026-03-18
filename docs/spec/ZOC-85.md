# ZOC-85 Specification: Playwright E2E Integration Testing for Bookmark Journeys

## 1) Scope (SDD)
Implement and validate end-to-end integration tests (Playwright) against the full running application stack for these user journeys:
1. Add bookmark and see it in list.
2. Search bookmark by title.
3. Delete bookmark and confirm removal.

## 2) Requirements
- Tests must run against an actual started app (web server + API routes), not mocked network calls.
- Selectors should use accessibility primitives (`getByLabel`, `getByRole`) for resilience.
- Test suite should be executable via one command: `npm run test:e2e`.

## 3) Acceptance Criteria
- Journey A (Create): user submits title+URL, bookmark appears in list.
- Journey B (Search): user filters by title text and matching bookmark remains visible.
- Journey C (Delete): user deletes bookmark and item is no longer present in list.
- Playwright config starts web server automatically and runs tests against it.

## 4) TDD Plan
### Red
- Author Playwright specs for all three journeys before implementing UI/API flows.
- Execute tests and capture failing output.

### Green
- Implement minimal full-stack bookmark app with:
  - `POST /api/bookmarks`
  - `GET /api/bookmarks?q=`
  - `DELETE /api/bookmarks/:id`
  - Browser UI form, search field, list rendering, delete action
- Re-run tests until all pass.

## 5) Security Plan
- Run local SAST scan (Semgrep when available).
- Run dependency audit (`npm audit`).
- Record all commands/results in `reports/security_scan.txt`.
- Remediate any High/Critical findings before completion.

## 6) Critic Review Checklist
- Tests are stable and independent.
- Coverage exactly maps to required journeys.
- App stack is truly integrated (UI + API + server lifecycle).
- No High/Critical security findings remain.
