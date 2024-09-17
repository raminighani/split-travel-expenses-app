import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Trips() {
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState("");
  const [people, setPeople] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState([]);

  useEffect(() => {
    const storedTrips = JSON.parse(localStorage.getItem("trips")) || [];
    setTrips(storedTrips);

    const storedPeople = JSON.parse(localStorage.getItem("people")) || [];
    setPeople(storedPeople);
  }, []);

  function addTrip() {
    if (newTrip.trim() && selectedPeople.length >= 0) {
      const updatedTrips = [
        ...trips,
        { id: Date.now(), name: newTrip, expenses: [], people: selectedPeople },
      ];
      setTrips(updatedTrips);
      localStorage.setItem("trips", JSON.stringify(updatedTrips));
      setNewTrip("");
      setSelectedPeople([]);
    }
  }

  function removeTrip(tripId) {
    const updatedTrips = trips.filter((trip) => trip.id !== tripId);
    setTrips(updatedTrips);
    localStorage.setItem("trips", JSON.stringify(updatedTrips));
  }

  function handlePersonSelect(person) {
    if (selectedPeople.includes(person)) {
      setSelectedPeople(selectedPeople.filter((p) => p !== person));
    } else {
      setSelectedPeople([...selectedPeople, person]);
    }
  }

  return (
    <div>
      <h2>Trips</h2>
      <input
        type="text"
        value={newTrip}
        onChange={(e) => setNewTrip(e.target.value)}
        placeholder="Add a trip"
      />
      <h4>Select people for this trip:</h4>
      <ul>
        {people.map((person, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={selectedPeople.includes(person)}
              onChange={() => handlePersonSelect(person)}
            />
            {person}
          </li>
        ))}
      </ul>
      <button onClick={addTrip}>Add Trip</button>

      <ul>
        {trips.map((trip) => (
          <li key={trip.id}>
            <Link to={`/trips/${trip.id}`}>{trip.name}</Link>
            <button onClick={() => removeTrip(trip.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Trips;
