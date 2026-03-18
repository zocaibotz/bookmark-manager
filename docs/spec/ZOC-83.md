# ZOC-83: Frontend Project Setup

## Summary
Build a frontend for the bookmark manager using Vite, React, TypeScript, React Router, Zustand, and Vitest. The app must provide bookmark-oriented routes, a centralized API service layer with robust error handling, and a frontend setup that starts cleanly in development.

## Goals
- Initialize a React frontend project in this repository.
- Add routes for `/`, `/bookmarks`, and `/bookmarks/:id`.
- Configure application state with Zustand.
- Connect the frontend to a backend API service with centralized error handling.
- Validate the implementation through test-first development.

## Non-Goals
- Full visual design polish beyond a clean functional baseline.
- End-to-end backend integration against a live remote service.
- Authentication or authorization flows.

## Functional Requirements
- The landing page must provide navigation into bookmark routes.
- The bookmarks list route must fetch and display bookmarks from the API.
- The bookmark detail route must fetch and display a single bookmark by id.
- Loading and error states must be visible for bookmark routes.
- The API client must normalize backend and network failures into predictable errors.

## Technical Design
### Stack
- Vite
- React 19 with TypeScript
- React Router
- Zustand
- Vitest with React Testing Library

### Routing
- `/`: Home page with primary navigation.
- `/bookmarks`: List page that loads bookmarks via Zustand store actions.
- `/bookmarks/:id`: Detail page that loads one bookmark via Zustand store actions.

### State Management
- Zustand store will hold:
  - `bookmarks`
  - `selectedBookmark`
  - `isLoading`
  - `error`
- Store actions will:
  - load bookmark collection
  - load bookmark detail
  - clear transient error state

### API Layer
- A central `apiRequest` helper will:
  - prepend a configurable base URL
  - set JSON headers
  - parse JSON responses safely
  - convert non-2xx responses into `ApiError`
  - convert fetch/network failures into `ApiError`
- `bookmarkService` will expose typed methods for list and detail requests.

## Test Plan
- Red phase:
  - route rendering test
  - Zustand store integration test
  - API client error normalization tests
- Green phase:
  - implement app and services until all tests pass
- Verification:
  - run unit tests
  - run production build
  - start dev server briefly to confirm startup

## Security Plan
- Run Semgrep against the repository.
- Run `npm audit` and review dependency findings.
- Record results in `reports/security_scan.txt`.
- Remediate any High or Critical issues before finalizing.

## Acceptance Mapping
- Frontend dev server runs without errors:
  - verified with `npm run dev -- --host 127.0.0.1`
- Routing functional with bookmark-related routes:
  - verified with route rendering tests
- API service layer configured with error handling:
  - verified with API client tests and store-driven route behavior
