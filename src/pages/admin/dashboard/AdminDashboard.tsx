import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/Icon";
import useAuth from "../../../hooks/useAuth";
import Logo from "../../../layouts/site/components/Logo";
import { getMe } from "../../../services/adminApiService";
import { clearAuth, setCurrentUser } from "../../../services/apiHelpers";

const AdminDashboard = () => {
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

      <section className="section">
        <div className="container" style={{ display: "grid", gap: 16 }}>
          <span className="eyebrow">Admin Dashboard</span>
          <h1 className="display-lg">
            Welcome back, <span className="text-gradient">{user?.name.split(" ")[0] ?? "Admin"}</span>.
          </h1>
          <p className="lead">You are signed in as an administrator.</p>
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
