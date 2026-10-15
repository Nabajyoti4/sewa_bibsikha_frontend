import { useState } from "react";
import { Link } from "react-router-dom";
import Accordion from "../../components/Accordion";
import Icon from "../../components/Icon";
import PageHero from "../../components/PageHero";
import Reveal from "../../components/Reveal";
import SectionHeading from "../../components/SectionHeading";
import ServiceCard from "../../components/ServiceCard";
import { coreCompetencies, faqs, serviceCategories } from "../../data/siteContent";
import type { ServiceCategory } from "../../data/siteContent";
import usePersona from "../../hooks/usePersona";
import { getPersona, hasSignals, rankServices } from "../../utils/personalization";
import "./Services.css";

const engagement = [
  { title: "Enquiry", text: "Share your requirement and site details.", icon: "mail" as const },
  { title: "Proposal", text: "Scope, timeline and transparent costing.", icon: "layers" as const },
  { title: "Execution", text: "Expert teams deliver on site and on paper.", icon: "tree" as const },
  { title: "Reporting", text: "Dashboards and audit-ready documentation.", icon: "chart" as const },
];

const Services = () => {
  const { persona, interests, trackInterest } = usePersona();
  const [filter, setFilter] = useState<ServiceCategory | "all">("all");
  const ranked = rankServices(persona, interests);
  const visible = filter === "all" ? ranked : ranked.filter((service) => service.category === filter);
  const personalised = hasSignals(persona, interests);

  const handleFilter = (id: ServiceCategory | "all") => {
    setFilter(id);
    if (id !== "all") trackInterest(id);
  };

  return (
    <>
      <PageHero
        crumb="Our Services"
        eyebrow="Our Services"
        title={
          <>
            Strategies and frameworks for <span className="text-gradient">fruitful outcomes.</span>
          </>
        }
        lead="Bibsikha understands the Indian market and the unique challenges that businesses face in the North-east. With over 10 years of field knowledge, our core team offers solutions based on each client’s requirement."
        aside={
          <div className="services-hero__chips">
            {serviceCategories.slice(1).map((category) => (
              <button
                key={category.id}
                type="button"
                className="chip"
                onClick={() => {
                  handleFilter(category.id);
                  document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {category.label}
              </button>
            ))}
          </div>
        }
      />

      <section className="section" id="catalogue">
        <div className="container">
          <div className="services-toolbar">
            <div className="filter-bar" role="tablist" aria-label="Filter services">
              {serviceCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === category.id}
                  className={`chip ${filter === category.id ? "is-active" : ""}`}
                  onClick={() => handleFilter(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
            {personalised && (
              <span className="services-toolbar__note">
                <Icon name="sparkle" size={16} />
                Sorted for {persona !== "explorer" ? getPersona(persona).label : "your interests"}
              </span>
            )}
          </div>

          <div className="grid-3" key={filter}>
            {visible.map((service, index) => (
              <Reveal key={service.id} delay={(index % 3) * 90}>
                <ServiceCard service={service} detailed recommended={personalised && filter === "all" && index === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container services-core">
          <SectionHeading
            eyebrow="Core competencies"
            title={
              <>
                Programmes we <span className="text-gradient">deliver.</span>
              </>
            }
            lead="We are committed to delivering sustainable growth to our clients by maintaining environmentally sustainable practices that embed a culture of safety, well-being and innovation."
          />
          <div className="services-core__grid">
            {coreCompetencies.map((item, index) => (
              <Reveal key={item} delay={(index % 5) * 60} variant="zoom" className="services-core__item">
                <Icon name="leaf" size={18} />
                {item}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark services-flow">
        <div className="container">
          <SectionHeading
            eyebrow="How we engage"
            title={
              <>
                Simple process. <span className="text-gold">Serious results.</span>
              </>
            }
          />
          <ol className="services-flow__list">
            {engagement.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 100} className="services-flow__item">
                <span className="services-flow__num">0{index + 1}</span>
                <span className="services-flow__icon">
                  <Icon name={step.icon} size={26} />
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container services-faq">
          <div className="services-faq__head">
            <SectionHeading
              eyebrow="FAQs"
              title={
                <>
                  Questions, <span className="text-gradient">answered.</span>
                </>
              }
              lead="Can’t find what you’re looking for? Our team is happy to help."
            />
            <Reveal delay={200}>
              <Link to="/contact" className="btn btn--gold">
                Ask us anything <Icon name="arrowRight" size={18} />
              </Link>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <Accordion items={faqs} />
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default Services;
