import { useState, useEffect } from "react";

function People() {
  const [people, setPeople] = useState([]);
  const [newPerson, setNewPerson] = useState("");

  useEffect(() => {
    const storedPeople = JSON.parse(localStorage.getItem("people")) || [];
    setPeople(storedPeople);
  }, []);

  function handleAddPerson() {
    if (!newPerson.trim()) return;
    if (people.includes(newPerson.trim())) {
      alert("This person already exists in the list.");
      return;
    }
    const updatedPeople = [...people, newPerson.trim()];
    setPeople(updatedPeople);
    localStorage.setItem("people", JSON.stringify(updatedPeople));
    setNewPerson("");
  }

  function handleRemovePerson(personToremove) {
    const updatedPeople = people.filter((person) => person !== personToremove);
    setPeople(updatedPeople);
    localStorage.setItem("people", JSON.stringify(updatedPeople));
  }

  return (
    <div>
      <h2>People</h2>
      <input
        type="text"
        value={newPerson}
        onChange={(e) => setNewPerson(e.target.value)}
        placeholder="Add a person"
      />
      <button onClick={handleAddPerson}>Add</button>

      <ul>
        {people.map((person, index) => (
          <li key={index}>
            {person}
            <button onClick={() => handleRemovePerson(person)}>remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default People;
