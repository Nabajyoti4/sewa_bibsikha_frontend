import { useState } from "react";
import type { CSSProperties } from "react";
import CountUp from "../../components/CountUp";
import Icon from "../../components/Icon";
import PageHero from "../../components/PageHero";
import Pagination from "../../components/Pagination";
import ProjectCard from "../../components/ProjectCard";
import Reveal from "../../components/Reveal";
import SectionHeading from "../../components/SectionHeading";
import { categoryLabels, cookingFacts, impactStats, projects, serviceCategories } from "../../data/siteContent";
import type { ServiceCategory } from "../../data/siteContent";
import useApiQuery from "../../hooks/useApiQuery";
import { listPublicProjects } from "../../services/apiService";
import { toProjectCard } from "../../utils/projectMapper";
import "./Projects.css";

const caseStudy = projects[0];

const caseStudyStages = [
  {
    label: "Challenge",
    text: "About 400 million people in India — 90% of them women — are exposed to indoor air pollution from biomass firewood, causing respiratory, pulmonary and vision problems. Women spend up to 5–8 hours a day cooking, and nearly 70% of rural households have no kitchen ventilation.",
  },
  {
    label: "Solution",
    text: "Through our clean energy cooking programme, we introduced energy-efficient, smokeless cook stoves — distributed and supported on the ground by our own field teams.",
  },
  {
    label: "Outcome",
    text: "3 lakh households so far now cook with less smoke, less drudgery and less harm to the environment — and we aim to reach 100,000 more households within the next quarter.",
  },
];

const Projects = () => {
  const [category, setCategory] = useState<ServiceCategory | "all">("all");
  const [page, setPage] = useState(1);
  const { data, error, loading } = useApiQuery(`${category}|${page}`, () =>
    listPublicProjects({ page, category: category === "all" ? undefined : category }),
  );
  const visible = data?.data.map(toProjectCard) ?? [];

  return (
    <>
      <PageHero
        crumb="Projects"
        eyebrow="Our Achievements"
        title={
          <>
            Proof on the <span className="text-gradient">ground.</span>
          </>
        }
        lead="Programmes we have designed and delivered across rural India — impacting the lives of more than 300,000 households to date."
        aside={
          <div className="projects-hero__mini">
            <div>
              <strong>3 Lakh+</strong>
              <span>Households reached</span>
            </div>
            <div>
              <strong>4+</strong>
              <span>States of operation</span>
            </div>
          </div>
        }
      />

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Case study" title={caseStudy.title} lead={caseStudy.summary} />
          <Reveal variant="zoom" className="case-study">
            <div
              className="case-study__visual"
              style={{ "--p1": caseStudy.palette[0], "--p2": caseStudy.palette[1] } as CSSProperties}
            >
              <div className="case-study__rings" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <span className="case-study__icon">
                <Icon name={caseStudy.icon} size={64} strokeWidth={1.2} />
              </span>
              {caseStudy.metrics && (
                <div className="case-study__metrics">
                  {caseStudy.metrics.map((metric) => (
                    <div key={metric.label}>
                      <strong>{metric.value}</strong>
                      <span>{metric.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="case-study__content">
              <div className="case-study__meta">
                <span className="tag">{categoryLabels[caseStudy.category]}</span>
                <span className="tag tag--gold">{caseStudy.status}</span>
                <span className="case-study__loc">
                  <Icon name="pin" size={14} /> {caseStudy.location}
                </span>
              </div>
              {caseStudyStages.map((stage, index) => (
                <div key={stage.label} className="case-study__stage">
                  <span className="case-study__stage-num">0{index + 1}</span>
                  <div>
                    <h3>{stage.label}</h3>
                    <p>{stage.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="projects-facts">
            {cookingFacts.map((fact, index) => (
              <Reveal key={fact.value} delay={index * 80} className="projects-facts__item">
                <strong>{fact.value}</strong>
                <span>{fact.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <SectionHeading
            eyebrow="Programmes"
            title={
              <>
                Explore our <span className="text-gradient">work.</span>
              </>
            }
          />

          <div className="filter-bar" role="tablist" aria-label="Filter by category">
            {serviceCategories.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={category === item.id}
                className={`chip ${category === item.id ? "is-active" : ""}`}
                onClick={() => {
                  setCategory(item.id);
                  setPage(1);
                }}
              >
                {item.id === "all" ? "All programmes" : item.label}
              </button>
            ))}
          </div>

          {error ? (
            <div className="projects-empty" role="alert">
              <Icon name="leaf" size={40} />
              <p>We couldn’t load our programmes right now. Please try again shortly.</p>
            </div>
          ) : !data ? (
            <div className="projects-empty" role="status">
              <Icon name="leaf" size={40} />
              <p>Loading programmes…</p>
            </div>
          ) : visible.length ? (
            <div className={`grid-3 ${loading ? "is-loading" : ""}`} key={`${category}-${data.pagination.page}`}>
              {visible.map((project, index) => (
                <Reveal key={project.id} delay={(index % 3) * 90}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="projects-empty">
              <Icon name="leaf" size={40} />
              <p>No programmes in this category yet — new work is always growing.</p>
            </div>
          )}

          <Pagination
            page={page}
            totalPages={data?.pagination.totalPages ?? 0}
            onPageChange={setPage}
            disabled={loading}
          />
        </div>
      </section>

      <section className="section section--dark projects-impact">
        <div className="container">
          <SectionHeading
            eyebrow="Our impact"
            align="center"
            title={
              <>
                Numbers that <span className="text-gold">keep growing.</span>
              </>
            }
          />
          <div className="projects-impact__grid">
            {impactStats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 90} className="projects-impact__item">
                <strong>
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </strong>
                <span>{stat.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Projects;
