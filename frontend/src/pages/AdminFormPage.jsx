import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { slugify } from "../utils/helpers";

function AdminFormPage({ mode, news = [], onSubmit, onDelete }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const current = mode === "edit" ? news.find((item) => item.id === id) : null;
  const [form, setForm] = useState({
    title: "",
    sourceUrl: "",
    date: "",
    summary: "",
    content: "",
    image: "",
    category: "latest"
  });
  const [errors, setErrors] = useState("");

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this news item?")) {
      return;
    }
    try {
      await onDelete(id);
      navigate("/admin/dashboard");
    } catch (error) {
      setErrors(error.message || "Failed to delete news item.");
    }
  };

  useEffect(() => {
    if (current) {
      setForm({
        title: current.title,
        sourceUrl: current.sourceUrl || "",
        date: current.date,
        summary: current.summary,
        content: current.content,
        image: current.image,
        category: current.category
      });
    }
  }, [current]);

  if (mode === "edit" && !current) {
    return (
      <section className="glass centered">
        <h1>Not found</h1>
      </section>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = [];
    if (!form.title.trim()) nextErrors.push("Title is required.");
    if (!form.sourceUrl.trim()) nextErrors.push("Source URL is required.");
    if (mode === "edit") {
      if (!form.date) nextErrors.push("Date is required.");
      if (!form.summary.trim()) nextErrors.push("Summary is required.");
      if (!form.content.trim()) nextErrors.push("Content is required.");
      if (!form.image.trim()) nextErrors.push("Image URL is required.");
      if (!["latest", "previous"].includes(form.category)) nextErrors.push("Invalid category.");
    }

    if (nextErrors.length) {
      setErrors(nextErrors.join(", "));
      return;
    }

    try {
      if (mode === "create") await onSubmit(form);
      else await onSubmit(id, form);
      navigate("/admin/dashboard");
    } catch (error) {
      setErrors(error.message || "Failed to save news article.");
    }
  };

  return (
    <section className="glass form-card">
      <h1>{mode === "create" ? "Add News" : "Edit News"}</h1>
      {errors ? <p className="error-text">{errors}</p> : null}
      <form className="form-grid" onSubmit={submit}>
        <label>
          Title
          <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
        </label>
        <label className="wide">
          Source URL
          <input
            type="url"
            value={form.sourceUrl}
            onChange={(e) => setForm((p) => ({ ...p, sourceUrl: e.target.value }))}
            placeholder="https://example.com/news-article"
          />
        </label>
        {mode === "edit" ? (
          <label>
            Auto Slug
            <input value={slugify(form.title)} readOnly />
          </label>
        ) : null}
        {mode === "edit" ? (
          <>
            <label>
              Date
              <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
            </label>
            <label>
              Image URL
              <input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} />
            </label>
            <label>
              Category
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                <option value="latest">Latest</option>
                <option value="previous">Previous</option>
              </select>
            </label>
            <label className="wide">
              Summary
              <textarea rows="3" value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))} />
            </label>
            <label className="wide">
              Content
              <textarea rows="9" value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} />
            </label>
          </>
        ) : (
          <p className="muted wide">Create mode uses only title and source URL. Other fields are auto-filled.</p>
        )}
        <button className="btn btn-primary" type="submit">
          {mode === "create" ? "Create" : "Update"} News
        </button>
        {mode === "edit" && onDelete && (
          <button className="btn btn-danger" type="button" onClick={handleDelete}>
            Delete
          </button>
        )}
      </form>
    </section>
  );
}

export default AdminFormPage;
