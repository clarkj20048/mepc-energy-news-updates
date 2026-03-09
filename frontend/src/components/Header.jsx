import { Link, useLocation } from "react-router-dom";

function Header({ isAuthenticated, onLogout }) {
  const location = useLocation();

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link to="/" className="brand">
          MEPC News
        </Link>
        <nav className="main-nav">
          <Link className="btn btn-primary" to="/">
            Home
          </Link>
          {isAuthenticated ? (
            <Link className="btn btn-primary" to="/admin/dashboard">
              Admin
            </Link>
          ) : null}
        </nav>
        <div className="header-actions">
          {isAuthenticated ? (
            <button className="btn btn-outline" type="button" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <Link to="/admin/login" className="btn btn-outline">
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
