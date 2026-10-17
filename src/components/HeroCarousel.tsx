import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import type { HeroSlideApiItem } from "../services/apiHelpers";
import HeroSlideImages from "./HeroSlideImages";
import Icon from "./Icon";
import "./HeroCarousel.css";

interface HeroCarouselProps {
  slides: HeroSlideApiItem[];
  imageDuration?: number;
}

const SWIPE_THRESHOLD = 40;

const HeroCarousel = ({ slides, imageDuration = 5000 }: HeroCarouselProps) => {
  const count = slides.length;
  const angle = 360 / count;
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [shown, setShown] = useState({ index: -1, count: 0 });
  const dragStart = useRef<number | null>(null);
  const frontSince = useRef(0);
  const index = ((step % count) + count) % count;
  const current = slides[index];

  useEffect(() => {
    frontSince.current = performance.now();
  }, [index]);

  // The front card rotates away once each of its images has had a turn. Cards share the same rhythm, so an
  // image ending right as a card reaches the front must not count as one of its turns.
  const handleImageShown = (slideIndex: number, timeStamp: number) => {
    if (slideIndex !== index || timeStamp - frontSince.current < imageDuration / 2) return;
    const seen = (shown.index === index ? shown.count : 0) + 1;
    if (seen >= current.images.length) {
      setStep((s) => s + 1);
      setShown({ index: -1, count: 0 });
    } else {
      setShown({ index, count: seen });
    }
  };

  const goTo = (target: number) => {
    let delta = (target - index) % count;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    setStep((s) => s + delta);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStart.current = event.clientX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    const delta = event.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(delta) > SWIPE_THRESHOLD) setStep((s) => s + (delta < 0 ? 1 : -1));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") setStep((s) => s + 1);
    if (event.key === "ArrowLeft") setStep((s) => s - 1);
  };

  return (
    <div
      className="hero-carousel"
      style={{ "--count": Math.max(count, 3) } as CSSProperties}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="hero-carousel__viewport"
        role="region"
        aria-roledescription="carousel"
        aria-label="Bibsikha programmes"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => (dragStart.current = null)}
      >
        <div className="hero-carousel__stage" style={{ transform: `translateZ(calc(var(--radius) * -1)) rotateY(${-step * angle}deg)` }}>
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className={`hero-slide ${i === index ? "is-active" : ""}`}
              style={{ transform: `rotateY(${i * angle}deg) translateZ(var(--radius))` }}
              aria-label={`${slide.title} — slide ${i + 1} of ${count}`}
              aria-current={i === index}
              tabIndex={-1}
              onClick={() => goTo(i)}
            >
              <HeroSlideImages
                images={slide.images}
                alt={slide.title}
                paused={paused || reducedMotion}
                duration={imageDuration}
                onImageShown={(timeStamp) => handleImageShown(i, timeStamp)}
              >
                <span className="hero-slide__title">{slide.title}</span>
              </HeroSlideImages>
              <span className="hero-slide__shade" />
              <span className="hero-slide__tag">{slide.tag}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="hero-carousel__footer">
        <div className="hero-carousel__caption" key={current.id} aria-live="polite">
          <span className="hero-carousel__count">
            {String(index + 1).padStart(2, "0")} <em>/ {String(count).padStart(2, "0")}</em>
          </span>
          <p>{current.caption}</p>
        </div>
        <div className="hero-carousel__controls">
          <button type="button" className="hero-carousel__btn" aria-label="Previous slide" onClick={() => setStep((s) => s - 1)}>
            <Icon name="arrowRight" size={18} className="hero-carousel__prev" />
          </button>
          <button type="button" className="hero-carousel__btn" aria-label="Next slide" onClick={() => setStep((s) => s + 1)}>
            <Icon name="arrowRight" size={18} />
          </button>
        </div>
      </div>

      <div className="hero-carousel__dots" role="tablist" aria-label="Choose slide">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={slide.title}
            className={i === index ? "is-active" : ""}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
