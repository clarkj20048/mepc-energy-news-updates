import { Link, useParams } from "react-router-dom";
import { formatDate } from "../utils/helpers";

function NewsDetailsPage({ news }) {
  const { slug } = useParams();
  const article = news.find((item) => item.slug === slug);

  if (!article) {
    return (
      <section className="glass centered">
        <h1>404</h1>
        <p>The page or news article you requested does not exist.</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </section>
    );
  }

  const related = news
    .filter((item) => item.slug !== article.slug && item.category === article.category)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return (
    <>
      <article className="article glass">
        <img className="article-banner" src={article.image} alt={article.title} />
        <div className="article-meta">
          <span className="chip">{article.category}</span>
          <p className="muted">{formatDate(article.date)}</p>
        </div>
        <h1>{article.title}</h1>
        <p className="article-summary">{article.summary}</p>
        <div className="article-content">{article.content}</div>
        {article.sourceUrl ? (
          <p>
            <a className="link" href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
              Original Source
            </a>
          </p>
        ) : null}
      </article>
      <section className="related">
        <h2>Related News</h2>
        <div className="related-grid">
          {related.map((item) => (
            <article className="related-card" key={item.id}>
              <h3>
                <Link to={`/news/${item.slug}`}>{item.title}</Link>
              </h3>
              <p className="muted">{formatDate(item.date)}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default NewsDetailsPage;
