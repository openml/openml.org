export function sign(payload, secret, options = {}) {
  // Create a proper JWT-like structure for mock purposes
  const header = { typ: "JWT", alg: "HS256" };
  const now = Math.floor(Date.now() / 1000);
  const exp =
    options.expiresIn === "3 days" ? now + 3 * 24 * 60 * 60 : now + 3600;

  const mockPayload = {
    ...payload,
    iat: now,
    exp: exp,
  };

  // Create a base64 encoded mock JWT
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(mockPayload));
  const signature = btoa(`mock-signature-${payload.userId}`);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verify(token, secret) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    const payload = JSON.parse(atob(parts[1]));

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error("Token expired");
    }

    return payload;
  } catch (error) {
    throw new Error("Invalid token");
  }
}
