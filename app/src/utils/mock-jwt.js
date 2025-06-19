export function sign(payload) {
  // Just return a fake token
  return `fake-jwt-token-for-${payload.userId}`;
}

export function verify(token) {
  if (!token.startsWith("fake-jwt-token-for-")) {
    throw new Error("Invalid token");
  }
  const userId = token.replace("fake-jwt-token-for-", "");
  return { userId };
}
