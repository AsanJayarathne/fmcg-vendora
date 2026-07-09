const BASE_URL = "http://localhost/fmcg-vendora/backend/api";

/**
 * Thin fetch wrapper for Vendora backend.
 * Automatically attaches Authorization: Bearer <token> header.
 * Throws a descriptive Error on non-2xx responses.
 *
 * @param {string} path     - API path e.g. "/retailer/products.php"
 * @param {string} token    - Bearer token from AuthContext
 * @param {object} options  - Optional fetch options (method, body, etc.)
 */
export async function apiFetch(path, token, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    const message = data?.message || `HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}
