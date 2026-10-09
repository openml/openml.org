// Local part: RFC 5322 "atext" characters and dots.
// Domain: dot-separated labels that may contain dashes but not start or end with one,
// followed by an alphabetic TLD.
const EMAIL_REGEX = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

export function isValidEmail(email) {
  return typeof email === "string" && EMAIL_REGEX.test(email);
}
