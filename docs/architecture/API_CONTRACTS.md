# API Contracts: Git Identity Verifier

## Module Contract
### `verify_identity(name: str, email: str, expected_domain: str | None = None) -> tuple[bool, list[str]]`

**Inputs**
- `name`: git author display name
- `email`: git author email
- `expected_domain`: optional domain policy (e.g. `company.com`)

**Behavior**
- Returns `ok=True` and empty error list when valid.
- Returns `ok=False` and one or more descriptive errors when invalid.

## CLI Contract
### Command
`python3 tools/git_identity.py [--name NAME] [--email EMAIL] [--domain DOMAIN]`

### Output
- Success: `Git identity verification passed.`
- Failure: `Git identity verification failed:` followed by bullet errors.

### Exit Codes
- `0`: verification passed
- `1`: verification failed

## Compatibility
- Backward compatible: new utility only; no breaking runtime/public API changes.
