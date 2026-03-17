# System Design: Git Identity Verification

## Overview
A small verification component validates git identity before commit/CI steps.

## Components
1. **Verifier Core (`tools/git_identity.py`)**
   - `verify_identity(name, email, expected_domain=None)`
   - Pure function returns `(ok, errors)` for testability.
2. **CLI Adapter**
   - Reads optional args or repository git config.
   - Emits human-readable errors and standard exit codes.
3. **Tests (`tests/test_git_identity.py`)**
   - Unit tests for validation logic and policy checks.

## Data Flow
1. Caller invokes CLI.
2. CLI resolves `name/email` from args or `git config`.
3. Core validates presence + email structure + optional domain.
4. CLI returns exit code `0` on success, `1` on validation failure.

## Error Handling
- Missing git binary/config value -> treated as missing field validation error.
- Domain mismatch -> explicit error with expected vs actual domain.

## Operational Notes
- No external services.
- No persistent storage.
- Safe for local and CI execution.
