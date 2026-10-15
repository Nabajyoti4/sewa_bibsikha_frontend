import type { ReactNode } from "react";
import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  align?: "left" | "center";
  action?: ReactNode;
}

const SectionHeading = ({ eyebrow, title, lead, align = "left", action }: SectionHeadingProps) => {
  if (action) {
    return (
      <div className="section-head section-head--split">
        <div>
          <Reveal>
            <span className="eyebrow">{eyebrow}</span>
          </Reveal>
          <Reveal as="h2" delay={80} className="display-lg">
            {title}
          </Reveal>
          {lead && (
            <Reveal as="p" delay={160} className="lead">
              {lead}
            </Reveal>
          )}
        </div>
        <Reveal delay={200}>{action}</Reveal>
      </div>
    );
  }

  return (
    <div className={`section-head ${align === "center" ? "section-head--center" : ""}`}>
      <Reveal>
        <span className="eyebrow">{eyebrow}</span>
      </Reveal>
      <Reveal as="h2" delay={80} className="display-lg">
        {title}
      </Reveal>
      {lead && (
        <Reveal as="p" delay={160} className="lead">
          {lead}
        </Reveal>
      )}
    </div>
  );
};

export default SectionHeading;
