const SKELETON_ROWS = 4;

export function ProductListSkeleton() {
  return (
    <ul className="product-list product-list--skeleton" aria-hidden="true">
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <li className="product-card product-card--skeleton" key={index}>
          <span className="skeleton-block skeleton-block--wide" />
          <span className="skeleton-block skeleton-block--narrow" />
        </li>
      ))}
    </ul>
  );
}
