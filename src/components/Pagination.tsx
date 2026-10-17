import Icon from "./Icon";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const getPageItems = (page: number, totalPages: number): (number | "gap")[] => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((item) => item >= 1 && item <= totalPages).sort((a, b) => a - b);
  return sorted.flatMap((item, index) => (index > 0 && item - sorted[index - 1] > 1 ? ["gap" as const, item] : [item]));
};

const Pagination = ({ page, totalPages, onPageChange, disabled = false }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination__btn"
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 1}
        aria-label="Previous page"
      >
        <Icon name="arrowRight" size={16} className="pagination__prev-icon" />
      </button>
      {getPageItems(page, totalPages).map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="pagination__gap">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`pagination__btn ${item === page ? "is-active" : ""}`}
            onClick={() => onPageChange(item)}
            disabled={disabled}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        className="pagination__btn"
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= totalPages}
        aria-label="Next page"
      >
        <Icon name="arrowRight" size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
