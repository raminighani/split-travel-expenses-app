import { Outlet } from 'react-router-dom';
import PageNav from '../components/PageNav';

const HomePage = () => {
  return (
    <main>
      <PageNav />
      <div className="px-10">
        <Outlet />
      </div>
    </main>
  );
};

export default HomePage;
