import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Icon from "../../components/Icon";
import useAuth from "../../hooks/useAuth";
import { getMe } from "../../services/adminApiService";
import { clearAuth, setCurrentUser } from "../../services/apiHelpers";
import Logo from "../site/components/Logo";

const adminNavLinks = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/projects", label: "Projects", end: false },
  { to: "/admin/hero-slides", label: "Hero Slider", end: false },
  { to: "/admin/contacts", label: "Contact Us", end: false },
];

const AdminPanelLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then(setCurrentUser)
      .catch(() => {
        // An expired/invalid token is cleared by apiHelpers, which redirects via ProtectedRoute.
      });
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/admin/login", { replace: true });
  };

  return (
    <>
      <header className="admin-topbar">
        <div className="container admin-topbar__inner">
          <Logo />
          <nav className="admin-nav" aria-label="Admin">
            {adminNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `admin-nav__link ${isActive ? "is-active" : ""}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="admin-topbar__user">
            <div className="admin-topbar__meta">
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
            <button type="button" className="btn btn--ghost" onClick={handleLogout}>
              Log out
              <Icon name="arrowRight" size={18} />
            </button>
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default AdminPanelLayout;
