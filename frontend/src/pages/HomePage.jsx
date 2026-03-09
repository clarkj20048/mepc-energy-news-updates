import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/helpers";

function toDateKey(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function sortByDate(items, direction = "desc") {
  return [...items].sort((a, b) => {
    const aTs = new Date(a.date).getTime();
    const bTs = new Date(b.date).getTime();
    return direction === "asc" ? aTs - bTs : bTs - aTs;
  });
}

function HomePage({ news }) {
  const [q, setQ] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    const keywordFiltered = keyword ? news.filter((item) => item.title.toLowerCase().includes(keyword)) : news;
    return dateFilter ? keywordFiltered.filter((item) => toDateKey(item.date) === dateFilter) : keywordFiltered;
  }, [news, q, dateFilter]);

  const latestNews = useMemo(
    () => sortByDate(filtered.filter((item) => item.category === "latest"), "desc").slice(0, 5),
    [filtered]
  );

  const previousSorted = useMemo(
    () => sortByDate(filtered.filter((item) => item.category === "previous"), sort === "oldest" ? "asc" : "desc"),
    [filtered, sort]
  );

  const totalPages = Math.max(1, Math.ceil(previousSorted.length / perPage));
  const safePage = Math.min(page, totalPages);
  const previousNews = previousSorted.slice((safePage - 1) * perPage, safePage * perPage);

  const scrollTrack = (id, dir) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  return (
    <>
      <section className="hero glass">
        <h1>Energy News Updates</h1>
        <p>Track latest announcements and News.</p>
        <div className="filters">
          <input className="filter-search" placeholder="Search by title keyword..." value={q} onChange={(e) => setQ(e.target.value)} />
          <input
            className="filter-date"
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter news by date"
          />
          <select className="filter-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
          </select>
          <select className="filter-page" value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
          </select>
          <button className="btn btn-primary filter-apply" type="button" onClick={() => setPage(1)}>
            Apply
          </button>
        </div>
      </section>

      <section className="section-block">
        <div className="section-title-row">
          <h2>Latest News</h2>
          <div className="scroll-buttons">
            <button className="scroll-btn" type="button" onClick={() => scrollTrack("latest-track", "left")}>
              &#8592;
            </button>
            <button className="scroll-btn" type="button" onClick={() => scrollTrack("latest-track", "right")}>
              &#8594;
            </button>
          </div>
        </div>
        <div className="news-track" id="latest-track">
          {latestNews.map((item) => (
            <article className="news-card" key={item.id}>
              <img src={item.image} alt={item.title} />
              <div className="card-body">
                <span className="chip">Latest</span>
                <h3>{item.title}</h3>
                <p className="muted">{formatDate(item.date)}</p>
                <p>{item.summary}</p>
                <Link className="link" to={`/news/${item.slug}`}>
                  Read more
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-title-row">
          <h2>Previous News</h2>
          <div className="scroll-buttons">
            <button className="scroll-btn" type="button" onClick={() => scrollTrack("previous-track", "left")}>
              &#8592;
            </button>
            <button className="scroll-btn" type="button" onClick={() => scrollTrack("previous-track", "right")}>
              &#8594;
            </button>
          </div>
        </div>
        <div className="news-track" id="previous-track">
          {previousNews.map((item) => (
            <article className="news-card" key={item.id}>
              <img src={item.image} alt={item.title} />
              <div className="card-body">
                <span className="chip chip-secondary">Previous</span>
                <h3>{item.title}</h3>
                <p className="muted">{formatDate(item.date)}</p>
                <p>{item.summary}</p>
                <Link className="link" to={`/news/${item.slug}`}>
                  Read more
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="pagination">
          <button className="btn btn-outline" type="button" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>
          <span>
            Page {safePage} of {totalPages}
          </span>
          <button className="btn btn-outline" type="button" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      </section>
    </>
  );
}

export default HomePage;
