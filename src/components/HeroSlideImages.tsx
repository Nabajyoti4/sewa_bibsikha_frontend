import { useState } from "react";
import type { AnimationEvent, CSSProperties, ReactNode } from "react";
import type { HeroSlideImage } from "../services/apiHelpers";
import "./HeroSlideImages.css";

interface HeroSlideImagesProps {
  images: HeroSlideImage[];
  alt: string;
  paused?: boolean;
  duration?: number;
  onImageShown?: (timeStamp: number) => void;
  /** Rendered at the bottom of the card, just below the progress bars. */
  children?: ReactNode;
}

const HeroSlideImages = ({ images, alt, paused = false, duration = 5000, onImageShown, children }: HeroSlideImagesProps) => {
  const [cycle, setCycle] = useState({ current: 0, previous: -1, round: 0 });
  const count = images.length;
  if (count === 0) return <span className="hero-slide-images__foot">{children}</span>;

  const current = cycle.current % count;
  const previous = cycle.previous === current ? -1 : cycle.previous;

  // The progress fill's animation is the timer, so pausing it also pauses the rotation.
  const handleProgressEnd = (event: AnimationEvent) => {
    setCycle((c) => ({ current: (c.current % count + 1) % count, previous: c.current % count, round: c.round + 1 }));
    onImageShown?.(event.timeStamp);
  };

  return (
    <span
      className={`hero-slide-images ${paused ? "is-paused" : ""}`}
      style={{ "--duration": `${duration}ms` } as CSSProperties}
    >
      {images.map((image, i) => (
        <img
          key={image.id}
          src={image.imageUrl}
          alt={i === current ? alt : ""}
          className={`hero-slide-images__img ${i === current ? "is-active" : ""} ${i === previous ? "is-leaving" : ""}`}
          style={{ "--pan": i % 2 ? "-3%" : "3%" } as CSSProperties}
          loading={i === 0 ? "eager" : "lazy"}
          draggable={false}
        />
      ))}
      <span className="hero-slide-images__foot">
        <span className="hero-slide-images__progress" aria-hidden="true">
          {images.map((image, i) => (
            <span key={image.id} className={`hero-slide-images__bar ${i < current ? "is-done" : ""}`}>
              {i === current && <span key={cycle.round} className="hero-slide-images__fill" onAnimationEnd={handleProgressEnd} />}
            </span>
          ))}
        </span>
        {children}
      </span>
    </span>
  );
};

export default HeroSlideImages;
