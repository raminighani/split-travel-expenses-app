import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function TripDetail() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [newExpense, setNewExpense] = useState({
    payer: "",
    amount: "",
    description: "",
  });
  const [totalExpensePerPerson, setTotalExpensePerPerson] = useState(null);
  const [settlement, setSettlement] = useState(null);
  const [newPerson, setNewPerson] = useState(""); // Input state for new person

  useEffect(() => {
    const storedTrips = JSON.parse(localStorage.getItem("trips")) || [];
    const foundTrip = storedTrips.find((t) => t.id === parseInt(tripId));
    setTrip(foundTrip);

    const savedSettlement = JSON.parse(
      localStorage.getItem(`settlement_${tripId}`)
    );
    if (savedSettlement) {
      setSettlement(savedSettlement);
    }
  }, [tripId]);

  // افزودن هزینه جدید
  function addExpense() {
    if (newExpense.payer && newExpense.amount && newExpense.description) {
      const updatedExpenses = [...trip.expenses, newExpense];
      const updatedTrip = { ...trip, expenses: updatedExpenses };
      updateTrip(updatedTrip);
      calculateTotalExpense(updatedTrip);
      setNewExpense({ payer: "", amount: "", description: "" });
    }
  }

  // محاسبه هزینه کل برای هر نفر
  function calculateTotalExpense(updatedTrip) {
    const total = updatedTrip.expenses.reduce(
      (acc, curr) => acc + parseFloat(curr.amount),
      0
    );
    const perPerson = total / updatedTrip.people.length;
    setTotalExpensePerPerson(perPerson.toFixed(2));
  }

  // محاسبه تسویه‌حساب
  function calculateSettlement() {
    if (trip && trip.expenses.length > 0) {
      const totalExpense = trip.expenses.reduce(
        (acc, curr) => acc + parseFloat(curr.amount),
        0
      );
      const amountPerPerson = totalExpense / trip.people.length;

      const balances = trip.people.map((person) => {
        const paidAmount = trip.expenses
          .filter((expense) => expense.payer === person)
          .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

        return {
          person,
          balance: paidAmount - amountPerPerson,
        };
      });

      setSettlement(balances);
      localStorage.setItem(`settlement_${tripId}`, JSON.stringify(balances));
    }
  }

  // به‌روزرسانی تریپ
  function updateTrip(updatedTrip) {
    const storedTrips = JSON.parse(localStorage.getItem("trips")) || [];
    const updatedTrips = storedTrips.map((t) =>
      t.id === updatedTrip.id ? updatedTrip : t
    );
    localStorage.setItem("trips", JSON.stringify(updatedTrips));
    setTrip(updatedTrip);
  }

  // حذف هزینه
  function removeExpense(index) {
    const updatedExpenses = trip.expenses.filter((_, i) => i !== index);
    const updatedTrip = { ...trip, expenses: updatedExpenses };
    updateTrip(updatedTrip);
    calculateTotalExpense(updatedTrip);
  }

  // حذف شخص از تریپ
  function removePersonFromTrip(person) {
    const updatedPeople = trip.people.filter((p) => p !== person);
    const updatedTrip = { ...trip, people: updatedPeople };
    updateTrip(updatedTrip);
  }

  // اضافه کردن شخص جدید به تریپ
  function addPersonToTrip() {
    if (!newPerson.trim()) return;
    if (trip.people.includes(newPerson.trim())) {
      alert("This person is already part of the trip.");
      return;
    }

    const updatedPeople = [...trip.people, newPerson.trim()];
    const updatedTrip = { ...trip, people: updatedPeople };
    updateTrip(updatedTrip);
    setNewPerson(""); // Reset the input field
  }

  if (!trip) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      <h3>Trip: {trip.name}</h3>

      <h4>People in this trip</h4>

      <ul>
        {trip.people.map((person, index) => (
          <li key={index}>
            {person}
            <button onClick={() => removePersonFromTrip(person)}>
              Remove from trip
            </button>
          </li>
        ))}
      </ul>

      <h4>Add a new person to the trip</h4>
      <input
        type="text"
        value={newPerson}
        onChange={(e) => setNewPerson(e.target.value)}
        placeholder="Enter person's name"
      />
      <button onClick={addPersonToTrip}>Add Person</button>

      <h4>Add Expense</h4>
      <select
        name="payer"
        value={newExpense.payer}
        onChange={(e) =>
          setNewExpense({ ...newExpense, payer: e.target.value })
        }
      >
        <option value="">Select Payer</option>
        {trip.people.map((person, index) => (
          <option key={index} value={person}>
            {person}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="amount"
        value={newExpense.amount}
        onChange={(e) =>
          setNewExpense({ ...newExpense, amount: e.target.value })
        }
        placeholder="Amount"
      />
      <input
        type="text"
        name="description"
        value={newExpense.description}
        onChange={(e) =>
          setNewExpense({ ...newExpense, description: e.target.value })
        }
        placeholder="Description"
      />
      <button onClick={addExpense}>Add Expense</button>

      <h4>Expenses</h4>
      <ul>
        {trip.expenses.map((expense, index) => (
          <li key={index}>
            {expense.payer} paid ${expense.amount} for {expense.description}
            <button onClick={() => removeExpense(index)}>Remove</button>
          </li>
        ))}
      </ul>

      <h4>Total Expense Per Person: ${totalExpensePerPerson}</h4>
      <button onClick={calculateSettlement}>Calculate Settlement</button>

      {settlement && (
        <div>
          <h4>Settlement</h4>
          <ul>
            {settlement.map((item, index) => (
              <li key={index}>
                {item.person} should {item.balance >= 0 ? "receive" : "pay"} $
                {Math.abs(item.balance).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TripDetail;
