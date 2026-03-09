import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { formatDate } from "../utils/helpers";

function AdminDashboardPage({ news, onDelete }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [error, setError] = useState("");

  const filtered = useMemo(
    () =>
      news
        .filter((item) => item.title.toLowerCase().includes(q.trim().toLowerCase()))
        .filter((item) => (category === "all" ? true : item.category === category))
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [news, q, category]
  );

  return (
    <>
      <section className="glass dashboard-head">
        <h1>Admin Dashboard</h1>
        <button className="btn btn-primary" type="button" onClick={() => navigate("/admin/news/new")}>
          Add News
        </button>
      </section>
      <section className="glass">
        {error ? <p className="error-text">{error}</p> : null}
        <div className="filters">
          <input placeholder="Search title..." value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            <option value="latest">Latest</option>
            <option value="previous">Previous</option>
          </select>
        </div>
      </section>
      <section className="table-wrap glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Date</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.slug}</td>
                <td>{formatDate(item.date)}</td>
                <td>
                  <span className="chip">{item.category}</span>
                </td>
                <td className="actions">
                  <Link className="btn btn-outline" to={`/news/${item.slug}`}>
                    View
                  </Link>
                  <button className="btn btn-primary" type="button" onClick={() => navigate(`/admin/news/${item.id}/edit`)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={async () => {
                      setError("");
                      try {
                        await onDelete(item.id);
                      } catch (err) {
                        setError(err.message || "Failed to delete item.");
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

export default AdminDashboardPage;
