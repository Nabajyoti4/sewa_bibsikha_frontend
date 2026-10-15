import { Link } from "react-router-dom";
import Icon from "../components/Icon";

const NotFound = () => {
  return (
    <section className="page-hero" style={{ minHeight: "80vh", textAlign: "center" }}>
      <div className="container" style={{ position: "relative", display: "grid", gap: 24, justifyItems: "center" }}>
        <span className="eyebrow">Error 404</span>
        <h1 className="display-xl">
          This path is still <span className="text-gradient">growing.</span>
        </h1>
        <p className="lead">The page you’re looking for doesn’t exist or has moved.</p>
        <Link to="/" className="btn btn--gold">
          Back to home <Icon name="arrowRight" size={18} />
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
