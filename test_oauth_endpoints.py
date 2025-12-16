#!/usr/bin/env python3
"""
Test OAuth endpoints locally

Usage:
  python test_oauth_endpoints.py
"""

import requests
import json

# Adjust this to your local Flask server
BASE_URL = "http://localhost:5000"


def test_github_oauth():
    """Test GitHub OAuth endpoint"""
    print("\n🧪 Testing GitHub OAuth endpoint...")

    payload = {
        "provider": "github",
        "providerId": "test_12345678",
        "email": "test_github@example.com",
        "name": "Test GitHub User",
        "image": "https://avatars.githubusercontent.com/u/12345678",
    }

    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/user/auth/oauth/github",
            json=payload,
            headers={"Content-Type": "application/json"},
        )

        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code in [200, 201]:
            print("✅ GitHub OAuth endpoint works!")
            return response.json().get("access_token")
        else:
            print("❌ GitHub OAuth endpoint failed")
            return None

    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def test_google_oauth():
    """Test Google OAuth endpoint"""
    print("\n🧪 Testing Google OAuth endpoint...")

    payload = {
        "provider": "google",
        "providerId": "test_1234567890",
        "email": "test_google@gmail.com",
        "name": "Test Google User",
        "image": "https://lh3.googleusercontent.com/test",
    }

    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/user/auth/oauth/google",
            json=payload,
            headers={"Content-Type": "application/json"},
        )

        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code in [200, 201]:
            print("✅ Google OAuth endpoint works!")
            return response.json().get("access_token")
        else:
            print("❌ Google OAuth endpoint failed")
            return None

    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def test_existing_user():
    """Test OAuth with existing user (same email)"""
    print("\n🧪 Testing OAuth with existing user...")

    # Use same email as first test
    payload = {
        "provider": "github",
        "providerId": "different_id_789",
        "email": "test_github@example.com",  # Same email as before
        "name": "Same User Different Provider",
        "image": "https://example.com/image.jpg",
    }

    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/user/auth/oauth/github",
            json=payload,
            headers={"Content-Type": "application/json"},
        )

        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            print("✅ Existing user login works!")
        else:
            print("⚠️ Expected 200 for existing user")

    except Exception as e:
        print(f"❌ Error: {e}")


def verify_token(token):
    """Verify JWT token works with protected endpoint"""
    if not token:
        print("\n⚠️ No token to verify")
        return

    print("\n🧪 Testing token with /verifytoken endpoint...")

    try:
        response = requests.get(
            f"{BASE_URL}/api/v1/user/verifytoken",
            headers={"Authorization": f"Bearer {token}"},
        )

        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")

        if response.status_code == 200:
            print("✅ JWT token is valid!")
        else:
            print("❌ Token verification failed")

    except Exception as e:
        print(f"❌ Error: {e}")


def main():
    print("=" * 60)
    print("🚀 OAuth Endpoints Test Suite")
    print("=" * 60)
    print(f"\nTesting against: {BASE_URL}")
    print("\n⚠️  Make sure your Flask server is running!")
    print("   Run: cd server && flask run")

    # Test GitHub OAuth (new user)
    github_token = test_github_oauth()

    # Test Google OAuth (new user)
    google_token = test_google_oauth()

    # Test existing user
    test_existing_user()

    # Verify one of the tokens
    if github_token:
        verify_token(github_token)

    print("\n" + "=" * 60)
    print("✅ Testing complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
