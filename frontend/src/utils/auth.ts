// Auth state is now managed via HttpOnly cookies — JS never touches the token.
// We use a lightweight flag in sessionStorage just to avoid an extra /user/me
// call on every render. The real auth check happens server-side on every request.

const AUTH_FLAG = "authed";

export function markAuthed() {
  sessionStorage.setItem(AUTH_FLAG, "1");
}

export function clearAuthed() {
  sessionStorage.removeItem(AUTH_FLAG);
}

export function isAuthed(): boolean {
  return sessionStorage.getItem(AUTH_FLAG) === "1";
}

// Legacy — kept so old imports don't break during migration
export function setToken(_token: string) {
  markAuthed();
}

export function getToken() {
  return null; // Token is in HttpOnly cookie, not accessible to JS
}

export function logout() {
  clearAuthed();
}