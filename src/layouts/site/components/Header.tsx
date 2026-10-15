import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Icon from "../../../components/Icon";
import { navLinks } from "../../../data/siteContent";
import Logo from "./Logo";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [menuPath, setMenuPath] = useState(location.pathname);

  if (menuPath !== location.pathname) {
    setMenuPath(location.pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(window.scrollY > 16);
        setProgress(max > 0 ? window.scrollY / max : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${menuOpen ? "is-open" : ""}`}>
      <div className="site-header__progress" style={{ transform: `scaleX(${progress})` }} />
      <div className="container site-header__inner">
        <Logo />

        <nav className="site-nav" aria-label="Primary">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => `site-nav__link ${isActive ? "is-active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/contact" className="btn btn--gold site-header__cta">
          Get a Consultation
          <Icon name="arrowRight" size={18} />
        </Link>

        <button
          type="button"
          className="site-header__toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? "close" : "menu"} size={24} />
        </button>
      </div>

      <div className="mobile-menu" aria-hidden={!menuOpen}>
        <nav className="mobile-menu__nav" aria-label="Mobile">
          {navLinks.map((link, index) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => `mobile-menu__link ${isActive ? "is-active" : ""}`}
              style={{ transitionDelay: menuOpen ? `${80 + index * 50}ms` : "0ms" }}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/contact" className="btn btn--gold" tabIndex={menuOpen ? 0 : -1}>
          Get a Consultation
          <Icon name="arrowRight" size={18} />
        </Link>
      </div>
    </header>
  );
};

export default Header;
