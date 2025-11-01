const API_URL = import.meta.env.VITE_API_URL || "https://auditoiso-backend-v4.onrender.com";

export async function request(endpoint, method = "GET", data = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || `Error HTTP ${res.status}`);
  }
  return json;
}
