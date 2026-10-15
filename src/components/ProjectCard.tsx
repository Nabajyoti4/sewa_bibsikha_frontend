import type { CSSProperties } from "react";
import { categoryLabels } from "../data/siteContent";
import type { Project } from "../data/siteContent";
import Icon from "./Icon";
import TiltCard from "./TiltCard";

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

const ProjectCard = ({ project, featured = false }: ProjectCardProps) => {
  const visualStyle = {
    "--p1": project.palette[0],
    "--p2": project.palette[1],
  } as CSSProperties;

  return (
    <TiltCard className={`project-card ${featured ? "project-card--featured" : ""}`} max={5}>
      <div className="project-card__visual" style={visualStyle}>
        <svg className="project-card__topo" viewBox="0 0 400 240" preserveAspectRatio="none" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => (
            <path
              key={i}
              d={`M-20 ${60 + i * 26} C 80 ${20 + i * 30}, 160 ${110 + i * 22}, 240 ${60 + i * 26} S 380 ${30 + i * 28}, 440 ${80 + i * 22}`}
            />
          ))}
        </svg>
        <span className="project-card__icon">
          <Icon name={project.icon} size={featured ? 56 : 40} strokeWidth={1.4} />
        </span>
        <span className={`project-card__status ${project.status === "Ongoing" ? "is-live" : ""}`}>{project.status}</span>
      </div>
      <div className="project-card__body">
        <div className="project-card__meta">
          <span className="tag">{categoryLabels[project.category]}</span>
          <span className="project-card__location">
            <Icon name="pin" size={14} />
            {project.location}
          </span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        {project.metrics && (
          <div className="project-card__metrics">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </TiltCard>
  );
};

export default ProjectCard;
