import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import NewsDetailsPage from "./pages/NewsDetailsPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminFormPage from "./pages/AdminFormPage";
import NotFoundPage from "./pages/NotFoundPage";
import {
  createNews as createNewsApi,
  deleteNews as deleteNewsApi,
  fetchAuthStatus,
  fetchNews,
  login as loginApi,
  logout as logoutApi,
  updateNews as updateNewsApi
} from "./api/client";
import "./App.css";

function App() {
  const [news, setNews] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [bootError, setBootError] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [auth, newsItems] = await Promise.all([fetchAuthStatus(), fetchNews()]);
        if (!mounted) return;
        setIsAuthenticated(auth);
        setNews(newsItems);
        setBootError("");
      } catch (error) {
        if (!mounted) return;
        setBootError(error.message);
      } finally {
        if (mounted) setIsBootstrapping(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const actions = useMemo(
    () => ({
      async login(username, password) {
        try {
          await loginApi(username, password);
          setIsAuthenticated(true);
          return { ok: true };
        } catch (error) {
          return { ok: false, error: error.message };
        }
      },
      async logout() {
        try {
          await logoutApi();
        } finally {
          setIsAuthenticated(false);
        }
      },
      async addNews(payload) {
        const item = await createNewsApi(payload);
        setNews((prev) => [item, ...prev]);
      },
      async updateNews(id, payload) {
        const item = await updateNewsApi(id, payload);
        setNews((prev) => prev.map((entry) => (entry.id === id ? item : entry)));
      },
      async deleteNews(id) {
        await deleteNewsApi(id);
        setNews((prev) => prev.filter((item) => item.id !== id));
      }
    }),
    []
  );

  if (isBootstrapping) {
    return (
      <BrowserRouter>
        <Header isAuthenticated={false} onLogout={actions.logout} />
        <main className="container page-content">
          <section className="glass centered">
            <h1>Loading...</h1>
          </section>
        </main>
      </BrowserRouter>
    );
  }

  if (bootError) {
    return (
      <BrowserRouter>
        <Header isAuthenticated={false} onLogout={actions.logout} />
        <main className="container page-content">
          <section className="glass centered">
            <h1>Unable to load app data</h1>
            <p>{bootError}</p>
          </section>
        </main>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Header isAuthenticated={isAuthenticated} onLogout={actions.logout} />
      <main className="container page-content">
        <Routes>
          <Route path="/" element={<HomePage news={news} />} />
          <Route path="/news/:slug" element={<NewsDetailsPage news={news} />} />
          <Route path="/admin/login" element={<AdminLoginPage isAuthenticated={isAuthenticated} onLogin={actions.login} />} />
          <Route
            path="/admin/dashboard"
            element={isAuthenticated ? <AdminDashboardPage news={news} onDelete={actions.deleteNews} /> : <Navigate to="/admin/login" replace />}
          />
          <Route
            path="/admin/news/new"
            element={isAuthenticated ? <AdminFormPage mode="create" onSubmit={actions.addNews} /> : <Navigate to="/admin/login" replace />}
          />
          <Route
            path="/admin/news/:id/edit"
            element={isAuthenticated ? <AdminFormPage mode="edit" news={news} onSubmit={actions.updateNews} onDelete={actions.deleteNews} /> : <Navigate to="/admin/login" replace />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
