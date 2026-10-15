import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import type { HeroSlide } from "../data/siteContent";
import Icon from "./Icon";
import "./HeroCarousel.css";

interface HeroCarouselProps {
  slides: HeroSlide[];
  interval?: number;
}

const SWIPE_THRESHOLD = 40;

const HeroCarousel = ({ slides, interval = 4200 }: HeroCarouselProps) => {
  const count = slides.length;
  const angle = 360 / count;
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragStart = useRef<number | null>(null);
  const index = ((step % count) + count) % count;
  const current = slides[index];

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setStep((s) => s + 1), interval);
    return () => window.clearInterval(timer);
  }, [paused, interval]);

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
      style={{ "--count": count } as CSSProperties}
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
              style={
                {
                  transform: `rotateY(${i * angle}deg) translateZ(var(--radius))`,
                  "--p1": slide.palette[0],
                  "--p2": slide.palette[1],
                } as CSSProperties
              }
              aria-label={`${slide.title} — slide ${i + 1} of ${count}`}
              aria-current={i === index}
              tabIndex={-1}
              onClick={() => goTo(i)}
            >
              {slide.image ? (
                <img src={slide.image} alt={slide.title} className="hero-slide__img" loading="lazy" draggable={false} />
              ) : (
                <span className="hero-slide__art" aria-hidden="true">
                  <svg viewBox="0 0 300 400" preserveAspectRatio="none">
                    {Array.from({ length: 9 }).map((_, line) => (
                      <path key={line} d={`M-20 ${40 + line * 44} C 80 ${10 + line * 46}, 180 ${90 + line * 40}, 320 ${30 + line * 44}`} />
                    ))}
                  </svg>
                  <span className="hero-slide__icon">
                    <Icon name={slide.icon} size={56} strokeWidth={1.3} />
                  </span>
                </span>
              )}
              <span className="hero-slide__shade" />
              <span className="hero-slide__tag">{slide.tag}</span>
              <span className="hero-slide__title">{slide.title}</span>
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
