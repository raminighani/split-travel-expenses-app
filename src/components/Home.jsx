import { NavLink } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div>
        <p className="mt-48 text-center text-4xl font-bold leading-10 text-stone-700">
          Welcome to the expense split App <br />{' '}
        </p>
        <p className="mb-6 mt-6 text-center text-4xl font-bold leading-10 text-stone-700">
          For start click
        </p>
      </div>
      <div className="w-48 align-middle">
        <p className="rounded-md bg-emerald-600 px-3 py-3 text-center font-sans text-2xl font-semibold text-white transition-colors duration-200 hover:bg-emerald-800">
          <NavLink to="people">Start Now</NavLink>
        </p>
      </div>
    </div>
  );
}

export default Home;
