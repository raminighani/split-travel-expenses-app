import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faPlus,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';

function Trips() {
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState('');
  const [people, setPeople] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [searchres, setSearchRes] = useState('');

  const filteredTripName = trips.filter((trip) =>
    trip.name.toLowerCase().includes(searchres.toLowerCase()),
  );

  const filteredPeopleName = people.filter((person) =>
    person.toLowerCase().includes(searchres.toLowerCase()),
  );

  useEffect(() => {
    const storedTrips = JSON.parse(localStorage.getItem('trips')) || [];
    setTrips(storedTrips);

    const storedPeople = JSON.parse(localStorage.getItem('people')) || [];
    setPeople(storedPeople);
  }, []);

  function addTrip() {
    if (newTrip.trim() && selectedPeople.length >= 0) {
      const updatedTrips = [
        ...trips,
        { id: Date.now(), name: newTrip, expenses: [], people: selectedPeople },
      ];
      setTrips(updatedTrips);
      localStorage.setItem('trips', JSON.stringify(updatedTrips));
      setNewTrip('');
      setSelectedPeople([]);
    }
    if (newTrip.trim()) {
      setIsOpen(false);
    } else {
      alert('please enter trip name');
    }
  }

  function removeTrip(tripId) {
    const updatedTrips = trips.filter((trip) => trip.id !== tripId);
    setTrips(updatedTrips);
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
  }

  function handlePersonSelect(person) {
    if (selectedPeople.includes(person)) {
      setSelectedPeople(selectedPeople.filter((p) => p !== person));
    } else {
      setSelectedPeople([...selectedPeople, person]);
    }
  }

  function handleIsOpen() {
    setIsOpen(!isOpen);
    setSelectedPeople([]);
  }
  return (
    <main className="mt-10 space-y-0">
      {/* <div className="w-1/3">
        <ul className="mt-5 space-y-1 divide-y">
          {trips.map((trip) => (
            <li key={trip.id} className="flex justify-between space-x-3 py-2">
              <Link
                to={`/trips/${trip.id}`}
                className="rounded-xl bg-stone-100 px-4 py-1 font-semibold text-emerald-600 hover:bg-emerald-600 hover:text-white"
              >
                {trip.name}
              </Link>
              <button
                onClick={() => removeTrip(trip.id)}
                className="rounded-xl bg-red-300 px-3 py-1 text-sm text-red-950 hover:bg-red-500 hover:opacity-80"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div> */}

      <div className="mx-6 mt-10 px-7">
        {/* people header */}
        <div>
          <p className="py-4 text-[32px] font-[500] leading-10">trips list</p>

          {/* add new person button && search  */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center justify-center rounded-[8px] border-2 border-[#051B11] bg-[#051B11] text-white">
              <button
                onClick={handleIsOpen}
                className="h-[35px] w-[80px] space-x-1 px-2"
              >
                <span>
                  <FontAwesomeIcon icon={faPlus} />
                </span>
                <span>NEW</span>
              </button>
            </div>
            <div className="relative">
              <span>
                <input
                  value={searchres}
                  onChange={(e) => setSearchRes(e.target.value)}
                  className="h-[36px] rounded-lg px-7"
                  type="text"
                  placeholder="search"
                />
                <span className="absolute bottom-[7px] left-[10px] text-[14px] text-[#9ca3bc]">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </span>
              </span>
            </div>
          </div>
          {/* add new person button && search End  */}
        </div>

        {/* Add Trips Form */}

        {isOpen && (
          <div className="popup">
            <div className="flex h-[449px] w-[544px] flex-col space-y-1 rounded-xl bg-white">
              <div className="ml-3 mt-3 flex items-center justify-between space-x-2 pl-3 pr-8 pt-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[28px] bg-wgrn">
                    <div className="flex h-[35px] w-[35px] items-center justify-center rounded-[28px] bg-tablegren">
                      <img
                        src="images/iconAdd.png"
                        alt=""
                        className="h-[21px] w-[22px]"
                      />
                    </div>
                  </div>
                  <p className="text-[18px] font-[600]">Create trip</p>
                </div>
                <div>
                  <button onClick={handleIsOpen}>
                    <img src="images/cros.png" alt="" />
                  </button>
                </div>
              </div>
              <div className="flex h-[80%] w-[544px] flex-col items-center space-y-4">
                <div>
                  <input
                    type="text"
                    value={newTrip}
                    onChange={(e) => setNewTrip(e.target.value)}
                    placeholder="Enter your trip name"
                    className="h-[44px] w-[368px] rounded-lg border-[1px] border-stone-200 bg-white px-3 py-0.5 focus:outline-none focus:ring-1 focus:ring-stone-200"
                  />
                </div>

                <div className="relative flex items-center justify-center">
                  <input
                    value={searchres}
                    onChange={(e) => setSearchRes(e.target.value)}
                    type="text"
                    placeholder="Search..."
                    className="h-[40px] w-[268px] rounded-l-lg border-[1px] border-stone-200 bg-white px-3 py-0.5 pl-6 text-[14px] focus:outline-none focus:ring-1 focus:ring-stone-200"
                  />
                  <span className="absolute bottom-[10px] left-[10px] text-[12px] text-[#9ca3bc]">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </span>
                  <button className="h-[40px] w-[100px] rounded-r-lg bg-bgrn text-white">
                    Search
                  </button>
                </div>

                <ul className="custom-scrollbar mt-5 flex h-[152px] w-[368px] flex-col overflow-y-scroll rounded-lg border-[1px]">
                  <p className="text-center">
                    {filteredPeopleName.length === 0 && 'no resault'}
                  </p>
                  {searchres.length < 3 &&
                    people.map((person, index) => (
                      <li key={index} className="px-4 py-1 text-base">
                        <label
                          className={`flex cursor-pointer items-center justify-between rounded-[4px] px-6 py-1 ${selectedPeople.includes(person) && 'bg-[#D1E7DD]'}`}
                        >
                          <span className="font-sans text-[14px] font-[500] text-[#344054]">
                            {person}
                          </span>
                          <input
                            type="checkbox"
                            checked={selectedPeople.includes(person)}
                            onChange={() => handlePersonSelect(person)}
                            className="h-[16px] w-[16px] rounded-[4px] border-[1px] border-[#D0D5DD] accent-emerald-400 hover:cursor-pointer"
                          />
                        </label>
                      </li>
                    ))}
                  {searchres.length >= 3 &&
                    filteredPeopleName.map((person, index) => (
                      <li key={index} className="px-4 py-2 text-base">
                        <label
                          className={`flex cursor-pointer justify-between`}
                        >
                          <span className="font-sans text-[14px] font-[500] text-[#344054]">
                            {person}
                          </span>
                          <input
                            type="checkbox"
                            checked={selectedPeople.includes(person)}
                            onChange={() => handlePersonSelect(person)}
                            className="h-[16px] w-[16px] rounded-[4px] border-[1px] border-[#D0D5DD] accent-emerald-400 hover:cursor-pointer"
                          />
                        </label>
                      </li>
                    ))}
                </ul>

                <div className="flex h-[44px] w-[368px] items-center justify-center">
                  <button
                    onClick={addTrip}
                    className="h-[44px] w-[128px] rounded-md bg-emerald-600 px-3 py-1 font-sans text-white transition-colors duration-200 hover:bg-emerald-800"
                  >
                    create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* <div className="hidden">
          <input
            type="text"
            value={newTrip}
            onChange={(e) => setNewTrip(e.target.value)}
            placeholder="Add a trip"
            className="mr-2 rounded-md border-2 border-stone-200 bg-stone-100 px-3 py-0.5 focus:outline-none focus:ring-2 focus:ring-stone-500"
          />
          <h4>Select people for this trip:</h4>
          <ul className="mt-5 space-y-1 divide-y">
            {people.map((person, index) => (
              <li
                key={index}
                className="flex w-1/6 space-x-2 px-4 py-2 text-base text-emerald-600"
              >
                <input
                  type="checkbox"
                  checked={selectedPeople.includes(person)}
                  onChange={() => handlePersonSelect(person)}
                  className="h-6 w-6 border border-emerald-400 accent-emerald-400 hover:cursor-pointer"
                />
                <span className="font-sans text-base font-semibold">
                  {person}
                </span>
              </li>
            ))}
          </ul>
          <button
            onClick={addTrip}
            className="rounded-md bg-emerald-600 px-3 py-1 font-sans text-white transition-colors duration-200 hover:bg-emerald-800"
          >
            Add Trip
          </button>
        </div> */}
        {/* Add Trips Form End */}

        {/* people header End */}

        <div className="mt-5 h-[500px] w-auto rounded-[20px] bg-tablegren px-8 py-5">
          <ul className="custom-scrollbar mt-5 h-[90%] list-inside overflow-auto pl-4">
            <li className="h-[60px] pl-6 pr-12">
              <div className="flex h-[60px] items-stretch space-x-6 divide-x-2 text-secondtxt">
                <span>#</span>
                <span className="pl-6">trips Name</span>
              </div>
            </li>
            <p className="text-center text-[30px]">
              {filteredTripName.length === 0 && 'no found'}
            </p>
            {searchres.length < 3 &&
              trips.map((trip, index) => (
                <li
                  key={trip.id}
                  className="h-[56px] pl-6 pr-12 even:bg-gray-100"
                >
                  <div className="flex h-[56px] items-center justify-between">
                    <div className="flex h-[56px] items-stretch space-x-6 divide-x-2">
                      <span className="flex items-center">{index + 1}</span>
                      <span className="flex items-center px-6">
                        <Link
                          to={`/trips/${trip.id}`}
                          className="rounded-xl px-4 py-1 font-semibold hover:text-emerald-600"
                        >
                          {trip.name}
                        </Link>
                      </span>
                    </div>
                    <div className="flex h-[60px] items-center space-x-3 border-l-2 pl-6">
                      <button
                        onClick={() => removeTrip(trip.id)}
                        className="rounded-lg border-2 border-graytxt bg-white px-3 py-2 text-sm text-black hover:bg-red-500 hover:opacity-80"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            {searchres.length >= 3 &&
              filteredTripName.map((trip, index) => (
                <li
                  key={trip.id}
                  className="h-[56px] pl-6 pr-12 even:bg-gray-100"
                >
                  <div className="flex h-[56px] items-center justify-between">
                    <div className="flex h-[56px] items-stretch space-x-6 divide-x-2">
                      <span className="flex items-center">{index + 1}</span>
                      <span className="flex items-center px-6">
                        <Link
                          to={`/trips/${trip.id}`}
                          className="rounded-xl px-4 py-1 font-semibold hover:text-emerald-600"
                        >
                          {trip.name}
                        </Link>
                      </span>
                    </div>
                    <div className="flex h-[60px] items-center space-x-3 border-l-2 pl-6">
                      <button
                        onClick={() => removeTrip(trip.id)}
                        className="rounded-lg border-2 border-graytxt bg-white px-3 py-2 text-sm text-black hover:bg-red-500 hover:opacity-80"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

export default Trips;
