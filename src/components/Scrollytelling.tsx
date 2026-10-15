import { useEffect, useRef, useState } from "react";
import type { ApproachStep } from "../data/siteContent";
import Icon from "./Icon";
import "./Scrollytelling.css";

interface ScrollytellingProps {
  steps: ApproachStep[];
}

const RING_RADIUS = 46;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

const Scrollytelling = ({ steps }: ScrollytellingProps) => {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [steps.length]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const node = containerRef.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const total = rect.height - window.innerHeight * 0.5;
        const scrolled = window.innerHeight * 0.5 - rect.top;
        setProgress(Math.min(Math.max(scrolled / total, 0), 1));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const current = steps[active];

  return (
    <div className="story" ref={containerRef}>
      <div className="story__sticky">
        <div className="story__visual">
          <svg className="story__ring" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r={RING_RADIUS} className="story__ring-track" />
            <circle
              cx="50"
              cy="50"
              r={RING_RADIUS}
              className="story__ring-fill"
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH * (1 - progress)}
            />
          </svg>

          {steps.map((step, index) => {
            const angle = (index / steps.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <span
                key={step.id}
                className={`story__node ${index <= active ? "is-done" : ""} ${index === active ? "is-active" : ""}`}
                style={{ left: `${50 + Math.cos(angle) * 46}%`, top: `${50 + Math.sin(angle) * 46}%` }}
              >
                {step.number}
              </span>
            );
          })}

          <div className="story__core" key={current.id}>
            <span className="story__core-icon">
              <Icon name={current.icon} size={40} strokeWidth={1.6} />
            </span>
            <span className="story__core-number">{current.number}</span>
            <span className="story__core-title">{current.title}</span>
          </div>
        </div>
      </div>

      <div className="story__steps">
        {steps.map((step, index) => (
          <article
            key={step.id}
            ref={(node) => {
              stepRefs.current[index] = node;
            }}
            data-index={index}
            className={`story__step ${index === active ? "is-active" : ""}`}
          >
            <span className="story__step-number">Step {step.number}</span>
            <h3 className="display-md">{step.title}</h3>
            <p>{step.description}</p>
            <ul>
              {step.points.map((point) => (
                <li key={point}>
                  <Icon name="check" size={16} strokeWidth={2.4} />
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Scrollytelling;
