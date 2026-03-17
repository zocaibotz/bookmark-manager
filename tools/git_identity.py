#!/usr/bin/env python3
"""Git identity verification utility for ZOC-79."""

from __future__ import annotations

import argparse
import subprocess
import sys
from typing import List, Tuple


def _get_git_config(key: str) -> str:
    try:
        result = subprocess.run(
            ["git", "config", "--get", key],
            check=False,
            capture_output=True,
            text=True,
        )
    except FileNotFoundError:
        return ""

    if result.returncode != 0:
        return ""
    return result.stdout.strip()


def verify_identity(name: str, email: str, expected_domain: str | None = None) -> Tuple[bool, List[str]]:
    errors: List[str] = []

    if not name or not name.strip():
        errors.append("Missing git user.name")

    if not email or not email.strip():
        errors.append("Missing git user.email")
    else:
        email = email.strip()
        if "@" not in email or email.startswith("@") or email.endswith("@"):
            errors.append("Invalid git user.email format")
        else:
            local, domain = email.rsplit("@", 1)
            if not local or not domain or "." not in domain:
                errors.append("Invalid git user.email format")
            elif expected_domain and domain.lower() != expected_domain.lower():
                errors.append(
                    f"Email domain mismatch: expected {expected_domain}, got {domain}"
                )

    return (len(errors) == 0, errors)


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify git identity")
    parser.add_argument("--name", help="Git user.name override")
    parser.add_argument("--email", help="Git user.email override")
    parser.add_argument("--domain", help="Expected email domain")
    args = parser.parse_args()

    name = args.name if args.name is not None else _get_git_config("user.name")
    email = args.email if args.email is not None else _get_git_config("user.email")

    ok, errors = verify_identity(name=name, email=email, expected_domain=args.domain)

    if ok:
        print("Git identity verification passed.")
        return 0

    print("Git identity verification failed:")
    for err in errors:
        print(f"- {err}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
