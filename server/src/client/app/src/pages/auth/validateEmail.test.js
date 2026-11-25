import { isValidEmail } from "./validateEmail";

describe("isValidEmail", () => {
  test.each([
    "john@example.com",
    "john-doe@example.com",
    "john@my-uni.edu",
    "first-last@sub-domain.example-site.co.uk",
    "john-@example.com",
    "john_doe@example.com",
    "john.doe@example.com",
    "john+tag@example.com",
    "JOHN@EXAMPLE.COM",
    "j@x.io",
  ])("accepts %s", (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  test.each([
    "",
    "john",
    "john@",
    "@example.com",
    "john@example",
    "john@@example.com",
    "john doe@example.com",
    "!!! john@example.com",
    "john@-example.com",
    "john@example-.com",
    "john@exa_mple.com",
    "john@example..com",
    "john@example.com.",
  ])("rejects %s", (email) => {
    expect(isValidEmail(email)).toBe(false);
  });

  test("rejects non-string input", () => {
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail(null)).toBe(false);
  });
});
