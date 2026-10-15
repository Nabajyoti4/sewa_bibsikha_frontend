import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import Reveal from "./Reveal";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  crumb: string;
  aside?: ReactNode;
}

const PageHero = ({ eyebrow, title, lead, crumb, aside }: PageHeroProps) => {
  return (
    <section className="page-hero">
      <div className="page-hero__blob page-hero__blob--green" aria-hidden="true" />
      <div className="page-hero__blob page-hero__blob--gold" aria-hidden="true" />
      <div className="container page-hero__inner">
        <div className="page-hero__content">
          <Reveal className="page-hero__crumbs">
            <Link to="/">Home</Link>
            <Icon name="arrowRight" size={14} />
            <span>{crumb}</span>
          </Reveal>
          <Reveal delay={80}>
            <span className="eyebrow">{eyebrow}</span>
          </Reveal>
          <Reveal as="h1" delay={140} className="display-xl">
            {title}
          </Reveal>
        </div>
        <Reveal className="page-hero__aside" delay={240}>
          <p className="lead">{lead}</p>
          {aside}
        </Reveal>
      </div>
    </section>
  );
};

export default PageHero;
