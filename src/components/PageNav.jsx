import { useState } from 'react';
import { NavLink } from 'react-router-dom';
// import styles from './PageNav.module.css';

function PageNav() {
  const [number, setNumber] = useState('');
  function handleNumber(value) {
    setNumber(value);
  }
  return (
    <nav className="flex h-screen flex-col items-start justify-between text-lg text-white">
      <ul className="space-y-5 pl-[21px] pt-10 font-sans text-[20px] font-[700]">
        <li
          onClick={() => handleNumber('1')}
          className={`asdaw ${number === '1' ? 'text-bgrn' : 'text-white'}`}
        >
          <NavLink to="/">People</NavLink>
        </li>
        <li
          onClick={() => handleNumber('2')}
          className={`asdaw ${number === '2' ? 'text-bgrn' : 'text-white'}`}
        >
          <NavLink to="trips">Trips</NavLink>
        </li>
        <li
          onClick={() => handleNumber('3')}
          className={`asdaw ${number === '3' ? 'text-bgrn' : 'text-white'}`}
        >
          <NavLink to="">about us</NavLink>
        </li>
      </ul>

      <div className="mb-[20px] h-[159px] w-[100%]">
        <img
          className="mx-auto h-[159px] w-[159px] rounded-full align-middle"
          src="images/logo.jpg"
          alt="ramin"
        />
      </div>
    </nav>
  );
}

export default PageNav;
