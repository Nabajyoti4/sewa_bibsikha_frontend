import { Link } from "react-router-dom";
import { categoryLabels } from "../data/siteContent";
import type { Service } from "../data/siteContent";
import usePersona from "../hooks/usePersona";
import Icon from "./Icon";

interface ServiceCardProps {
  service: Service;
  detailed?: boolean;
  recommended?: boolean;
}

const ServiceCard = ({ service, detailed = false, recommended = false }: ServiceCardProps) => {
  const { trackInterest } = usePersona();

  return (
    <article id={detailed ? service.id : undefined} className={`service-card ${recommended ? "is-recommended" : ""}`}>
      {recommended && (
        <span className="service-card__badge">
          <Icon name="sparkle" size={14} />
          Recommended
        </span>
      )}
      <span className="service-card__icon">
        <Icon name={service.icon} size={28} strokeWidth={1.6} />
      </span>
      <span className="service-card__category">{categoryLabels[service.category]}</span>
      <h3>{service.title}</h3>
      <p>{detailed ? service.description : service.short}</p>
      {detailed && (
        <ul className="service-card__points">
          {service.points.map((point) => (
            <li key={point}>
              <Icon name="check" size={16} strokeWidth={2.4} />
              {point}
            </li>
          ))}
        </ul>
      )}
      <Link
        to={detailed ? "/contact" : `/services#${service.id}`}
        className="link-arrow service-card__link"
        onClick={() => trackInterest(service.category)}
      >
        {detailed ? "Enquire about this" : "Learn more"}
        <Icon name="arrowRight" size={18} />
      </Link>
    </article>
  );
};

export default ServiceCard;
