type CatalogEmptyStateProps = {
  query: string;
};

export function CatalogEmptyState({ query }: CatalogEmptyStateProps) {
  return (
    <div className="catalog-empty" role="status">
      <p className="catalog-empty__title">No products match your search</p>
      <p className="catalog-empty__hint">
        Nothing found for &ldquo;{query}&rdquo;. Try a different name or clear
        the search.
      </p>
    </div>
  );
}
