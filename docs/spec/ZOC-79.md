# ZOC-79: Git Identity Fix Verification

## 1. Context
Developers occasionally commit with missing or incorrect Git identity (`user.name`, `user.email`).
This creates attribution issues and CI/review friction.

## 2. Problem
There is no lightweight, repository-local verification mechanism that can be used in local checks/CI to ensure Git identity is configured and optionally matches an approved domain/pattern.

## 3. Goals
- Provide a deterministic verifier for Git identity.
- Fail with actionable messages when identity is missing/invalid.
- Keep solution dependency-free and CI-friendly.

## 4. Non-Goals
- Mutating global git config automatically.
- Enforcing organization membership via remote API calls.

## 5. Functional Requirements
1. Verify both `user.name` and `user.email` are present.
2. Verify email format includes `@` and domain segment.
3. Allow optional expected email domain check.
4. Return machine-readable exit code semantics.

## 6. Technical Approach (SDD)
- Add `tools/git_identity.py` with reusable verification function + CLI.
- Add unit tests in `tests/test_git_identity.py`.
- CI/local usage:
  - `python3 tools/git_identity.py --name "..." --email "..." --domain example.com`
  - Without name/email args, CLI reads from `git config --get`.

## 7. Acceptance Criteria
- Tests written first and demonstrated failing (Red).
- Implementation added and tests pass (Green).
- Security scan report exists with no High/Critical findings.
- Architecture docs updated.

## 8. Risks
- False negatives for uncommon but valid email syntaxes.
- Environment differences where git binary is unavailable.

## 9. Rollout
- Merge into `ZOC-79` PR.
- Optional follow-up: wire into CI pre-check job.
