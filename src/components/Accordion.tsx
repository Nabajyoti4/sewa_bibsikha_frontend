import { useState } from "react";
import Icon from "./Icon";

interface AccordionProps {
  items: { q: string; a: string }[];
}

const Accordion = ({ items }: AccordionProps) => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="accordion">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.q} className={`accordion__item ${isOpen ? "is-open" : ""}`}>
            <button
              type="button"
              className="accordion__trigger"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${index}`}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              {item.q}
              <Icon name="plus" />
            </button>
            <div className="accordion__panel" id={`faq-panel-${index}`} role="region">
              <div>
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
