export function HomePage() {
  return (
    <section className="shell-page">
      <h2>Shell (host application)</h2>
      <p>
        Routing, navigation, and auth context live here. Product and cart
        domains are loaded as federated remotes on their routes.
      </p>
      <ul className="shell-page__list">
        <li>
          <strong>/products</strong> — lazy-loads <code>mfe_products</code>
        </li>
        <li>
          <strong>/cart</strong> — lazy-loads <code>mfe_cart</code>
        </li>
        <li>
          <strong>Shared React</strong> — singleton via Module Federation
        </li>
      </ul>
      <p className="shell-page__tip">
        To demo failure handling: stop the cart remote dev server and open{" "}
        <code>/cart</code>.
      </p>
    </section>
  );
}
