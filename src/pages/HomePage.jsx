import { Outlet } from 'react-router-dom';
import PageNav from '../components/PageNav';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
  return (
    <main className="fontfamily flex h-screen">
      <div className="w-[208px] bg-grn">
        <PageNav />
      </div>
      <div className="h-[100vh] w-[100%] overflow-y-auto">
        <div className="flex h-[59px] w-[100%] items-center justify-center bg-grn">
          <p className="font[700] text-center text-[20px] text-white">
            expence tracker
          </p>
        </div>
        {/* user info */}
        {/* <div className="ml-6 w-auto space-y-14 pl-7">
          <div className="mt-8 flex h-[40px] w-[162px] items-center rounded-lg bg-white px-2 py-1">
            <div className="flex w-[100%] items-center justify-between">
              <img
                className="h-[24px] w-[24px]"
                src="images/person.jpg"
                alt=""
              />
              <span className="text-sm font-[500]">user name</span>

              <span className="">
                <FontAwesomeIcon icon={faCaretDown} />
              </span>
            </div>
          </div>
        </div> */}
        {/* user info End */}

        <Outlet />
      </div>
    </main>
  );
};

export default HomePage;
