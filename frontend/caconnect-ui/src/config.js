const origin = window.location.origin;
const wsOrigin = origin.replace(/^http/, 'ws');

export const config = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || `${origin}/api`,
  KEYCLOAK_URL:
    import.meta.env.VITE_KEYCLOAK_URL || `${origin}`,
  WS_URL:
    import.meta.env.VITE_WS_URL || `${wsOrigin}/ws`,
  KEYCLOAK_CLIENT_ID:
    import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "ca-connect",
  FRONTEND_URL:
    import.meta.env.VITE_FRONTEND_URL || origin,
};