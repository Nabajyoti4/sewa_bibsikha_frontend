import Icon from "./Icon";

interface MarqueeProps {
  items: string[];
}

const Marquee = ({ items }: MarqueeProps) => {
  const loop = [...items, ...items];

  return (
    <div className="marquee" aria-label={items.join(", ")}>
      <div className="marquee__track" aria-hidden="true">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="marquee__item">
            <Icon name="leaf" size={20} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
