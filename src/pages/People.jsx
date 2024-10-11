import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faPlus,
  faTrashCan,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';

function People() {
  const [people, setPeople] = useState([]);
  const [newPerson, setNewPerson] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchres, setSearchRes] = useState('');

  const filteredName = people.filter((name) =>
    name.toLowerCase().includes(searchres.toLowerCase()),
  );

  useEffect(() => {
    const storedPeople = JSON.parse(localStorage.getItem('people')) || [];
    setPeople(storedPeople);
  }, []);

  function handleIsOpen() {
    setIsOpen(!isOpen);
  }

  function handleAddPerson() {
    if (!newPerson.trim()) return;
    if (people.includes(newPerson.trim())) {
      alert('This person already exists in the list.');
      return;
    }
    const updatedPeople = [...people, newPerson.trim()];
    setPeople(updatedPeople);
    localStorage.setItem('people', JSON.stringify(updatedPeople));
    setNewPerson('');
    setIsOpen(false);
  }

  function handleRemovePerson(personToremove) {
    const updatedPeople = people.filter((person) => person !== personToremove);
    setPeople(updatedPeople);
    localStorage.setItem('people', JSON.stringify(updatedPeople));
  }

  return (
    <main>
      <div className="mx-6 mt-10 h-[650.625px] px-7">
        {/* people header-------------------------------------------------------------------------------------------- */}
        <div>
          <p className="py-3 text-[32px] font-[500] leading-10">people list</p>

          {/* add new person button && search  -------------------------------------------------------------*/}
          <div className="mt-3 flex items-center justify-between">
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
                  className="h-[36px] rounded-lg border-[1px] border-[#ADB5BD] px-7"
                  type="text"
                  placeholder="Search "
                />
                <span className="absolute bottom-[7px] left-[10px] text-[14px] text-[#9ca3bc]">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </span>
              </span>
            </div>
          </div>
          {/* add new person button && search End-------------------------------------------------------------  */}
        </div>
        {/* people header End -------------------------------------------------------------------*/}

        {/* Add Person Form -------------------------------------------------------------- */}
        {isOpen && (
          <div className="popup">
            <div className="flex h-[208px] w-[544px] flex-col space-y-1 rounded-xl bg-white">
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
                  <p className="text-[18px] font-[600]">Please enter name</p>
                </div>
                <div>
                  <button onClick={handleIsOpen}>
                    <img src="images/cros.png" alt="" />
                  </button>
                </div>
              </div>
              <div className="flex h-[208px] w-[544px] flex-col items-center space-y-4">
                <input
                  type="text"
                  value={newPerson}
                  onChange={(e) => setNewPerson(e.target.value)}
                  placeholder="Enter your name"
                  className="mr-2 h-[44px] w-[368px] rounded-lg border-[1px] border-stone-200 bg-white px-3 py-0.5 focus:outline-none focus:ring-1 focus:ring-stone-200"
                />
                <div className="flex h-[44px] w-[368px] items-center justify-center">
                  <button
                    onClick={handleAddPerson}
                    className="h-[44px] w-[128px] rounded-md bg-emerald-600 px-3 py-1 font-sans text-white transition-colors duration-200 hover:bg-emerald-800"
                  >
                    SAVE
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Add Person Form End -----------------------------------------------------------------------------*/}

        {/* People List ------------------------------------------------------------------------------------------ */}
        <div className="mt-5 w-[1,611px] overflow-hidden rounded-[20px] bg-tablegren px-8 py-5">
          <ul className="custom-scrollbar mt-5 h-[420px] list-inside overflow-auto pl-4">
            <li className="h-[60px] pl-6 pr-12">
              <div className="flex h-[60px] items-stretch space-x-6 divide-x-2 text-secondtxt">
                <span className="w-[15px]">#</span>
                <span className="pl-6">full name</span>
              </div>
            </li>
            <p className="text-center text-[30px]">
              {filteredName.length === 0 && 'not found'}
            </p>
            {searchres.length < 3 &&
              people.map((person, index) => (
                <li key={index} className="h-[56px] pl-6 pr-12 odd:bg-gray-100">
                  <div className="flex h-[56px] items-center justify-between">
                    <div className="flex h-[56px] items-stretch space-x-6 divide-x-2">
                      <span className="flex w-[15px] items-center">
                        {index + 1}
                      </span>
                      <span className="flex items-center px-6">{person}</span>
                    </div>
                    <div className="flex h-[60px] items-center space-x-3 border-l-2 pl-6">
                      <button className="rounded-lg border-2 border-graytxt bg-white px-3 py-2 text-sm text-black hover:bg-red-500 hover:opacity-80">
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        onClick={() => handleRemovePerson(person)}
                        className="rounded-lg border-2 border-graytxt bg-white px-3 py-2 text-sm text-black hover:bg-red-500 hover:opacity-80"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            {searchres.length >= 3 &&
              filteredName.map((person, index) => (
                <li key={index} className="h-[56px] pl-6 pr-12 odd:bg-gray-100">
                  <div className="flex h-[56px] items-center justify-between">
                    <div className="flex h-[56px] items-stretch space-x-6 divide-x-2">
                      <span className="flex w-[15px] items-center">
                        {index + 1}
                      </span>
                      <span className="flex w-[15px] items-center px-6">
                        {person}
                      </span>
                    </div>
                    <div className="flex h-[60px] items-center space-x-3 border-l-2 pl-6">
                      <button className="rounded-lg border-2 border-graytxt bg-white px-3 py-2 text-sm text-black hover:bg-red-500 hover:opacity-80">
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        onClick={() => handleRemovePerson(person)}
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
        {/* People List End ------------------------------------------------------------------------------------------ */}
      </div>
    </main>
  );
}

export default People;
