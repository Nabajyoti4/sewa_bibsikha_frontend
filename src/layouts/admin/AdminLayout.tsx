import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import "../site/SiteLayout.css";
import "./AdminLayout.css";

const PageLoader = () => (
  <div className="page-loader" role="status" aria-label="Loading">
    <span className="page-loader__leaf" />
  </div>
);

const AdminLayout = () => {
  return (
    <div className="admin">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default AdminLayout;
