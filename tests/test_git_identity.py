import unittest

from tools.git_identity import verify_identity


class TestGitIdentityVerification(unittest.TestCase):
    def test_valid_identity_passes(self):
        ok, errors = verify_identity("Zi", "zi@example.com")
        self.assertTrue(ok)
        self.assertEqual(errors, [])

    def test_missing_name_fails(self):
        ok, errors = verify_identity("", "zi@example.com")
        self.assertFalse(ok)
        self.assertIn("Missing git user.name", errors)

    def test_missing_email_fails(self):
        ok, errors = verify_identity("Zi", "")
        self.assertFalse(ok)
        self.assertIn("Missing git user.email", errors)

    def test_invalid_email_fails(self):
        ok, errors = verify_identity("Zi", "zi-at-example")
        self.assertFalse(ok)
        self.assertIn("Invalid git user.email format", errors)

    def test_domain_mismatch_fails(self):
        ok, errors = verify_identity("Zi", "zi@other.com", expected_domain="example.com")
        self.assertFalse(ok)
        self.assertIn("Email domain mismatch: expected example.com, got other.com", errors)


if __name__ == "__main__":
    unittest.main()
