// Backend API base URL - points to Render backend
const API_BASE_URL = "https://mepc-energy-news-updates.onrender.com";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    const error = data.error || data.errors?.[0] || "Request failed";
    throw new Error(error);
  }

  return data;
}

export async function fetchAuthStatus() {
  const data = await request("/api/auth/status");
  return data.isAuthenticated;
}

export async function login(username, password) {
  await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  });
}

export async function logout() {
  await request("/api/auth/logout", { method: "POST" });
}

export async function fetchNews() {
  const data = await request("/api/news");
  return data.news || [];
}

export async function createNews(payload) {
  const data = await request("/api/admin/news", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return data.item;
}

export async function updateNews(id, payload) {
  const data = await request(`/api/admin/news/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
  return data.item;
}

export async function deleteNews(id) {
  await request(`/api/admin/news/${id}`, { method: "DELETE" });
}
