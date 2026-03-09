import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function AdminLoginPage({ isAuthenticated, onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    const result = await onLogin(form.username, form.password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/admin/dashboard");
  };

  return (
    <section className="auth-card glass">
      <h1>Admin Login</h1>
      {error ? <p className="error-text">{error}</p> : null}
      <form className="form-grid" onSubmit={submit}>
        <label>
          Username
          <input value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
        </label>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </section>
  );
}

export default AdminLoginPage;
