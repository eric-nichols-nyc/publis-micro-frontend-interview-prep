import { NavLink, Outlet } from "react-router-dom";
import { useUser } from "../context/user-context";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "shell-nav__link shell-nav__link--active" : "shell-nav__link";

export function ShellLayout() {
  const user = useUser();

  return (
    <div className="shell">
      <header className="shell-header">
        <div>
          <p className="shell-header__eyebrow">Module Federation demo</p>
          <h1>Shop Shell</h1>
        </div>
        <p className="shell-header__user">
          Signed in as <strong>{user.name}</strong>
        </p>
      </header>
      <nav aria-label="Main" className="shell-nav">
        <NavLink className={navLinkClass} end to="/">
          Home
        </NavLink>
        <NavLink className={navLinkClass} to="/products">
          Products
        </NavLink>
        <NavLink className={navLinkClass} to="/cart">
          Cart
        </NavLink>
        <NavLink className={navLinkClass} to="/interview">
          Interview notes
        </NavLink>
      </nav>
      <main className="shell-main">
        <Outlet />
      </main>
    </div>
  );
}
