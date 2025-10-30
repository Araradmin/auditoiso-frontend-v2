export const API_BASE = 'https://auditoiso-backend-v2.onrender.com/api';
export async function apiFetch(path, options = {}, token) {
  const headers = Object.assign({'Content-Type':'application/json'}, options.headers||{});
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API_BASE + path, { ...options, headers });
  if (!res.ok) throw new Error((await safeJson(res))?.error || 'Error de red');
  const ct = res.headers.get('content-type')||'';
  return ct.includes('application/json') ? res.json() : res;
}
async function safeJson(res) { try { return await res.json() } catch { return null } }
