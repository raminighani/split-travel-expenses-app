import { useState, useEffect } from 'react';

function People() {
  const [people, setPeople] = useState([]);
  const [newPerson, setNewPerson] = useState('');

  useEffect(() => {
    const storedPeople = JSON.parse(localStorage.getItem('people')) || [];
    setPeople(storedPeople);
  }, []);

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
  }

  function handleRemovePerson(personToremove) {
    const updatedPeople = people.filter((person) => person !== personToremove);
    setPeople(updatedPeople);
    localStorage.setItem('people', JSON.stringify(updatedPeople));
  }

  return (
    <main>
      <div className="mt-10">
        <h2 className="mb-10 text-2xl font-bold text-stone-500">
          People Management
        </h2>
        <input
          type="text"
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          placeholder="Add a person"
          className="mr-2 rounded-md border-2 border-stone-200 bg-stone-100 px-3 py-0.5 focus:outline-none focus:ring-2 focus:ring-stone-500"
        />
        <button
          onClick={handleAddPerson}
          className="rounded-md bg-emerald-600 px-3 py-1 font-sans text-white transition-colors duration-200 hover:bg-emerald-800"
        >
          Add
        </button>
        <div className="w-1/3">
          <ul className="mt-5 space-y-1 divide-y">
            {people.map((person, index) => (
              <li key={index} className="flex justify-between space-x-3 py-2">
                <span className="rounded-xl bg-stone-100 px-4 py-1 text-center text-base text-emerald-600">
                  {person}
                </span>
                <button
                  onClick={() => handleRemovePerson(person)}
                  className="rounded-xl bg-red-300 px-3 py-1 text-sm text-red-950 hover:bg-red-500 hover:opacity-80"
                >
                  remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

export default People;
