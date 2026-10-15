import { Link } from "react-router-dom";

interface LogoProps {
  light?: boolean;
}

const Logo = ({ light = false }: LogoProps) => {
  return (
    <Link to="/" className={`logo ${light ? "logo--light" : ""}`} aria-label="Bibsikha home">
      <svg className="logo__mark" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="18" fill="currentColor" />
        <path d="M32 12c11 6 16 15 16 24a16 16 0 0 1-32 0c0-9 5-18 16-24z" fill="#2fa36f" />
        <path d="M32 18v34M32 34l8-7M32 42l-8-7" stroke="#e8b931" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      </svg>
      <span className="logo__text">
        <span className="logo__name">Bibsikha</span>
        <span className="logo__tag">Climate Advisory Group</span>
      </span>
    </Link>
  );
};

export default Logo;
