import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Trips() {
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState('');
  const [people, setPeople] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState([]);

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

  return (
    <div className="mt-10 space-y-3">
      <h2 className="mb-5 text-2xl font-bold text-stone-500">Trips</h2>
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
            <span className="font-sans text-base font-semibold">{person}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={addTrip}
        className="rounded-md bg-emerald-600 px-3 py-1 font-sans text-white transition-colors duration-200 hover:bg-emerald-800"
      >
        Add Trip
      </button>
      <div className="w-1/3">
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
      </div>
    </div>
  );
}

export default Trips;
