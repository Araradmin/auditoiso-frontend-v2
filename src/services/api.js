// src/services/AuthService.js  (o donde tengas tus llamadas API)

const API_URL = import.meta.env.VITE_API_URL || "https://auditoiso-backend-v4.onrender.com";

// 🔹 Helper para peticiones JSON
async function request(endpoint, method = "GET", data = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("❌ Error en solicitud:", result);
    throw new Error(result.error || "Error en la solicitud");
  }
  return result;
}

// 🔹 Registro de usuario
export async function registerUser(name, email, password) {
  console.log("📤 Enviando registro a:", `${API_URL}/auth/register`);
  return request("/auth/register", "POST", { name, email, password });
}

// 🔹 Inicio de sesión
export async function loginUser(email, password) {
  console.log("📤 Enviando login a:", `${API_URL}/auth/login`);
  return request("/auth/login", "POST", { email, password });
}

// 🔹 Cierre de sesión
export async function logoutUser(token) {
  console.log("📤 Enviando logout a:", `${API_URL}/auth/logout`);
  return request("/auth/logout", "POST", null, token);
}

// 🔹 Obtener auditorías del usuario
export async function getAudits(token) {
  return request("/audits", "GET", null, token);
}

// 🔹 Crear nueva auditoría
export async function createAudit(token, standard, score, comments, results = []) {
  return request("/audits", "POST", { standard, score, comments, results }, token);
}
