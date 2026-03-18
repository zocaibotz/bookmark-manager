# ZOC-84 Spec - Frontend Bookmark UI Features

## Summary
Implement a browser-based bookmark manager UI that supports list rendering, search/filter, bookmark creation with validation, edit/delete actions, and clickable tag filters.

## Scope
- Bookmark list view showing title, URL, and tags.
- Search input that filters bookmarks by title or URL (case-insensitive).
- Add bookmark form with required validation (title + URL) and URL format validation.
- Edit action to update existing bookmark fields.
- Delete action guarded by a confirmation dialog.
- Tag buttons that can filter the visible list by selected tag.

## Data Model
A bookmark object:
- `id: string`
- `title: string`
- `url: string` (must be valid `http`/`https` URL)
- `tags: string[]`

## Functional Requirements
1. **List Rendering**
   - UI displays each bookmark with title text, URL as clickable link, and tag chips/buttons.
2. **Search**
   - Search query filters any bookmark where title or URL contains the query text.
3. **Add Form Validation**
   - Title required.
   - URL required and valid (`http`/`https`).
   - Validation errors shown inline.
4. **Edit**
   - Edit button prefills form.
   - Save updates selected bookmark in list.
5. **Delete**
   - Delete button triggers `window.confirm`.
   - On confirm=true, remove bookmark.
   - On confirm=false, leave unchanged.
6. **Tag Filter**
   - Clicking a tag sets active tag filter.
   - Clicking "All" clears tag filter.
   - Search and tag filters compose (AND logic).

## Non-Functional Requirements
- Use plain JavaScript modules.
- Escape rendered text to reduce XSS risk in UI templates.
- Keep domain logic testable independently from DOM logic.

## Test Strategy (TDD)
- Domain tests (`tests/bookmarks.test.js`): validation, filter logic, CRUD operations.
- UI tests (`tests/ui.test.js`): rendering, search, tag filtering, add validation, delete confirmation.
- Red phase: run tests against stubs (expect failures).
- Green phase: implement feature logic and rerun tests to pass.

## Security Considerations
- Validate URL format with `URL` parser and protocol allowlist.
- Escape dynamic strings inserted into HTML.
- Use `rel="noopener noreferrer"` for external links.
- Run dependency audit (`npm audit`) and static checks (`eslint`).
