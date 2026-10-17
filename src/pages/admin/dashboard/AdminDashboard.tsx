import { Link } from "react-router-dom";
import Icon from "../../../components/Icon";
import useAuth from "../../../hooks/useAuth";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <section className="section">
      <div className="container" style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <span className="eyebrow">Admin Dashboard</span>
        <h1 className="display-lg">
          Welcome back, <span className="text-gradient">{user?.name.split(" ")[0] ?? "Admin"}</span>.
        </h1>
        <p className="lead">You are signed in as an administrator.</p>
        <Link to="/admin/projects/new" className="btn btn--gold" style={{ marginTop: 12 }}>
          Create a project
          <Icon name="arrowRight" size={18} />
        </Link>
      </div>
    </section>
  );
};

export default AdminDashboard;
