import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import CountUp from "../../components/CountUp";
import HeroCarousel from "../../components/HeroCarousel";
import Icon from "../../components/Icon";
import Marquee from "../../components/Marquee";
import ProjectCard from "../../components/ProjectCard";
import Reveal from "../../components/Reveal";
import Scrollytelling from "../../components/Scrollytelling";
import SectionHeading from "../../components/SectionHeading";
import ServiceCard from "../../components/ServiceCard";
import TiltCard from "../../components/TiltCard";
import {
  approachSteps,
  brand,
  businessQuestions,
  categoryLabels,
  cookingFacts,
  coreCompetencies,
  dimensions,
  heroSlides,
  impactStats,
  personas,
  projects,
  strengths,
} from "../../data/siteContent";
import type { ServiceCategory } from "../../data/siteContent";
import usePersona from "../../hooks/usePersona";
import { getPersona, hasSignals, rankServices } from "../../utils/personalization";
import "./Home.css";

const splitHeadline = (headline: string) => {
  const words = headline.split(" ");
  return { lead: words.slice(0, -2).join(" "), tail: words.slice(-2).join(" ") };
};

const Home = () => {
  const { persona, setPersona, interests } = usePersona();
  const activePersona = getPersona(persona);
  const { lead, tail } = splitHeadline(activePersona.headline);
  const recommended = rankServices(persona, interests).slice(0, 3);
  const personalised = hasSignals(persona, interests);
  const topInterest = Object.entries(interests).sort((a, b) => b[1] - a[1])[0] as [ServiceCategory, number];

  const recommendationReason =
    persona !== "explorer"
      ? `Because you’re visiting as ${activePersona.label}`
      : topInterest[1] > 0
        ? `Based on your interest in ${categoryLabels[topInterest[0]]}`
        : "Our core services";

  return (
    <>
      <section className="hero">
        <div className="hero__bg" aria-hidden="true">
          <span className="hero__blob hero__blob--one" />
          <span className="hero__blob hero__blob--two" />
        </div>

        <div className="container hero__inner">
          <div className="hero__content">
            <Reveal>
              <span className="hero__pill">
                <span className="hero__pill-dot" />
                {brand.tagline}
              </span>
            </Reveal>

            <h1 className="display-xl hero__title" key={persona}>
              {lead} <span className="text-gradient">{tail}</span>
            </h1>

            <p className="lead hero__lead" key={`${persona}-lead`}>
              {activePersona.pitch}
            </p>

            <Reveal delay={200} className="hero__persona">
              <span className="hero__persona-label">
                <Icon name="sparkle" size={16} />
                Personalise your experience — I’m visiting as:
              </span>
              <div className="hero__persona-chips" role="radiogroup" aria-label="Visitor type">
                {personas.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={persona === item.id}
                    className={`chip ${persona === item.id ? "is-active" : ""}`}
                    onClick={() => setPersona(item.id)}
                  >
                    <Icon name={item.icon} size={16} />
                    {item.label}
                  </button>
                ))}
              </div>
            </Reveal>

            <Reveal delay={280} className="hero__actions">
              <Link to={persona === "industry" ? "/contact" : "/projects"} className="btn btn--gold">
                {activePersona.cta}
                <Icon name="arrowRight" size={18} />
              </Link>
              <Link to="/services" className="btn btn--ghost">
                Our services
              </Link>
            </Reveal>
          </div>

          <Reveal variant="zoom" delay={150} className="hero__visual">
            <HeroCarousel slides={heroSlides} />
          </Reveal>
        </div>

        <div className="container">
          <Reveal delay={300} className="stats-strip hero__stats">
            {impactStats.map((stat) => (
              <div key={stat.label} className="stats-strip__item">
                <div className="stats-strip__value">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="stats-strip__label">{stat.label}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <Marquee items={coreCompetencies} />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow={brand.legalName}
            title={
              <>
                The questions every business <span className="text-gradient">is asking.</span>
              </>
            }
          />
          <div className="home-questions">
            {businessQuestions.map((question, index) => (
              <Reveal key={question} delay={index * 90} className="home-questions__card">
                <span className="home-questions__num">0{index + 1}</span>
                <p>{question}</p>
              </Reveal>
            ))}
            <Reveal delay={360} className="home-questions__answer">
              <Icon name="sparkle" size={28} />
              <p>
                With <strong>Bibsikha</strong>, you will not just be able to find solutions to the above but also the{" "}
                <span className="text-gold">framework and manpower</span> to execute these to grow your business manifold.
              </p>
              <Link to="/contact" className="btn btn--gold">
                Find your solution <Icon name="arrowRight" size={18} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <SectionHeading
            eyebrow="What we do"
            title={
              <>
                Climate solutions with the power <span className="text-gradient">to execute.</span>
              </>
            }
            lead="An Environment & Sustainability Consulting Company delivering tailor-made solutions for private and public sector clients across India."
          />

          <div className="bento">
            <Reveal className="bento__cell bento__cell--green bento__cell--wide bento__cell--tall home-bento__consult">
              <span className="bento__icon">
                <Icon name="coins" />
              </span>
              <h3>Carbon Credit Management</h3>
              <p>
                Climate consciousness is the new business currency. We help companies earn great returns through Carbon Trading
                and the Voluntary Carbon Market.
              </p>
              <div className="home-bento__market">
                <strong>$300B</strong>
                <span>Global carbon credit trading market per year — set to become twice as large.</span>
              </div>
              <div className="home-bento__leafs" aria-hidden="true">
                <Icon name="leaf" size={220} strokeWidth={0.6} />
              </div>
              <Link to="/approach" className="link-arrow bento__foot home-bento__link">
                Our approach to carbon trading <Icon name="arrowRight" size={18} />
              </Link>
            </Reveal>

            <Reveal delay={80} className="bento__cell bento__cell--gold">
              <span className="bento__big">
                <CountUp value={3} suffix="L+" />
              </span>
              <h3>Households impacted</h3>
              <p>Rural households reached with clean energy solutions.</p>
            </Reveal>

            <Reveal delay={160} className="bento__cell bento__cell--white">
              <span className="bento__icon">
                <Icon name="sun" />
              </span>
              <h3>Renewable Energy</h3>
              <p>Solar-based power trading products, lanterns and street lights.</p>
            </Reveal>

            <Reveal delay={120} className="bento__cell bento__cell--white bento__cell--wide home-bento__tech">
              <div>
                <span className="bento__icon">
                  <Icon name="users" />
                </span>
                <h3>Manpower that delivers</h3>
                <p>Between 350 and 600 project-based employees working on large-scale programmes at any time.</p>
              </div>
              <div className="home-bento__chart" aria-hidden="true">
                {[35, 48, 44, 60, 56, 72, 68, 90].map((h, i) => (
                  <span key={i} style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section home-recs">
        <div className="container">
          <SectionHeading
            eyebrow={personalised ? "Picked for you" : "Our services"}
            title={
              <>
                {personalised ? "Recommended " : "How we "}
                <span className="text-gradient">{personalised ? "for you." : "can help."}</span>
              </>
            }
            lead={recommendationReason + ". Your selections stay on this device and refine these suggestions as you explore."}
            action={
              <Link to="/services" className="btn btn--green">
                All services <Icon name="arrowRight" size={18} />
              </Link>
            }
          />
          <div className="grid-3">
            {recommended.map((service, index) => (
              <Reveal key={service.id} delay={index * 100}>
                <ServiceCard service={service} recommended={personalised && index === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--cream home-story" style={{ "--story-bg": "var(--cream)" } as CSSProperties}>
        <div className="container">
          <SectionHeading
            eyebrow="Our approach"
            align="center"
            title={
              <>
                From opportunity to <span className="text-gradient">manifold growth.</span>
              </>
            }
            lead="Scroll through how we turn climate challenges into business and community outcomes."
          />
          <Scrollytelling steps={approachSteps} />
          <div className="home-story__more">
            <Link to="/approach" className="btn btn--ghost">
              Explore our approach <Icon name="arrowRight" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Our achievements"
            title={
              <>
                3,00,000 households <span className="text-gradient">and counting.</span>
              </>
            }
            lead="Our clean energy cooking programme is reducing the harmful impact of smoke pollution on health and the environment."
            action={
              <Link to="/projects" className="btn btn--green">
                View all projects <Icon name="arrowRight" size={18} />
              </Link>
            }
          />
          <div className="home-achieve">
            <Reveal className="home-achieve__project">
              <ProjectCard project={projects[0]} featured />
            </Reveal>
            <div className="home-achieve__facts">
              {cookingFacts.map((fact, index) => (
                <Reveal key={fact.value} delay={index * 90} className="home-achieve__fact">
                  <strong>{fact.value}</strong>
                  <span>{fact.label}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--dark home-tech">
        <div className="home-tech__grid-bg" aria-hidden="true" />
        <div className="container">
          <SectionHeading
            eyebrow="Three-dimensional approach"
            title={
              <>
                Energy. Environment. <span className="text-gold">Ecosystem.</span>
              </>
            }
            lead="An integrated and effective platform for conservation projects — backed by field exposure and the manpower to deliver."
          />
          <div className="grid-3">
            {dimensions.map((item, index) => (
              <Reveal key={item.title} delay={index * 90}>
                <TiltCard className="home-tech__card">
                  <span className="home-tech__icon">
                    <Icon name={item.icon} size={26} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          <div className="home-strengths">
            {strengths.map((item, index) => (
              <Reveal key={item.title} delay={index * 100} className="home-strengths__item">
                <Icon name={item.icon} size={24} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-quote">
        <div className="container">
          <Reveal variant="zoom" className="home-quote__card">
            <Icon name="pin" size={40} className="home-quote__icon" />
            <p className="home-quote__text">
              Headquartered in Jorhat, Assam — with expertise in natural resource conservation, climate change mitigation and
              adaptation.
            </p>
            <div className="home-quote__author">
              <span className="home-quote__avatar">BB</span>
              <div>
                <strong>{brand.ceo}</strong>
                <span>CEO, Bibsikha</span>
              </div>
            </div>
            <div>
              <Link to="/about" className="link-arrow home-quote__link">
                About Bibsikha <Icon name="arrowRight" size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default Home;
