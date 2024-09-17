import { Link, NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";

function PageNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="people">People</NavLink>
        </li>
        <li>
          <NavLink to="trips">Trips</NavLink>
        </li>
      </ul>
      <img src="/logo.png" alt="ramin" />
    </nav>
  );
}

export default PageNav;
