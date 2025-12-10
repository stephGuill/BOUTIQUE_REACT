import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
        🏠 Accueil
      </Link>

      <Link to="/cart" style={{ color: "white", textDecoration: "none" }}>
        🛒 Panier
      </Link>
    </nav>
  );
}

export default NavBar;