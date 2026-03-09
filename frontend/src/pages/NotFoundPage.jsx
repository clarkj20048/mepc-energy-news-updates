import { Link } from "react-router-dom";

function NotFoundPage() {
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

export default NotFoundPage;
