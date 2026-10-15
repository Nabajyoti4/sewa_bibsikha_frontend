import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./SiteLayout.css";

const PageLoader = () => (
  <div className="page-loader" role="status" aria-label="Loading">
    <span className="page-loader__leaf" />
  </div>
);

const SiteLayout = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    let attempts = 0;
    let timer = 0;
    const scrollToHash = () => {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempts++ < 20) {
        timer = window.setTimeout(scrollToHash, 100);
      }
    };
    scrollToHash();
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return (
    <div className="site">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default SiteLayout;
