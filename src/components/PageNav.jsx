import { NavLink } from 'react-router-dom';
// import styles from './PageNav.module.css';

function PageNav() {
  return (
    <nav className="flex h-20 flex-row items-center justify-between bg-emerald-600 px-10 text-lg text-white">
      <ul className="font-pizza flex flex-row justify-between gap-3 gap-x-7 font-sans">
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
