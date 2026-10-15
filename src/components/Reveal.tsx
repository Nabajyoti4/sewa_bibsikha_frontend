import type { CSSProperties, ElementType, ReactNode } from "react";
import useInView from "../hooks/useInView";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  variant?: "up" | "left" | "right" | "zoom";
  className?: string;
  style?: CSSProperties;
}

const Reveal = ({ children, as: Tag = "div", delay = 0, variant = "up", className = "", style }: RevealProps) => {
  const { ref, inView } = useInView<HTMLElement>();
  const variantClass = variant === "up" ? "" : `reveal--${variant}`;

  return (
    <Tag
      ref={ref}
      className={`reveal ${variantClass} ${inView ? "is-visible" : ""} ${className}`.trim()}
      style={{ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
