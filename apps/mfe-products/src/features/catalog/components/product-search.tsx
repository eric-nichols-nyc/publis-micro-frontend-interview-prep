type ProductSearchProps = {
  query: string;
  onQueryChange: (value: string) => void;
  resultCount: number;
};

export function ProductSearch({
  query,
  onQueryChange,
  resultCount,
}: ProductSearchProps) {
  return (
    <div className="catalog-search">
      <label className="catalog-search__label" htmlFor="product-search">
        Search products
      </label>
      <input
        className="catalog-search__input"
        id="product-search"
        type="search"
        placeholder="Filter by name…"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        autoComplete="off"
      />
      <p className="catalog-search__meta" aria-live="polite">
        {resultCount} {resultCount === 1 ? "product" : "products"} shown
      </p>
    </div>
  );
}
