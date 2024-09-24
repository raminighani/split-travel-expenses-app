import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function TripDetail() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [newExpense, setNewExpense] = useState({
    payer: '',
    amount: '',
    description: '',
    splitBetween: [], // People who the expense will be split between
  });
  const [totalExpensePerPerson, setTotalExpensePerPerson] = useState(null);
  const [settlement, setSettlement] = useState(null);
  const [newPerson, setNewPerson] = useState(''); // Input state for new person

  useEffect(() => {
    const storedTrips = JSON.parse(localStorage.getItem('trips')) || [];
    const foundTrip = storedTrips.find((t) => t.id === parseInt(tripId));
    setTrip(foundTrip);

    const savedSettlement = JSON.parse(
      localStorage.getItem(`settlement_${tripId}`),
    );
    if (savedSettlement) {
      setSettlement(savedSettlement);
    }
  }, [tripId]);

  // افزودن هزینه جدید
  function addExpense() {
    if (
      newExpense.payer &&
      newExpense.amount &&
      newExpense.description &&
      newExpense.splitBetween.length > 0
    ) {
      const updatedExpenses = [...trip.expenses, newExpense];
      const updatedTrip = { ...trip, expenses: updatedExpenses };
      updateTrip(updatedTrip);
      calculateTotalExpense(updatedTrip);
      setNewExpense({
        payer: '',
        amount: '',
        description: '',
        splitBetween: [],
      });
    }
  }

  // محاسبه هزینه کل برای هر نفر
  function calculateTotalExpense(updatedTrip) {
    const total = updatedTrip.expenses.reduce(
      (acc, curr) => acc + parseFloat(curr.amount),
      0,
    );
    const perPerson = total / updatedTrip.people.length;
    setTotalExpensePerPerson(perPerson.toFixed(2));
  }

  // محاسبه تسویه‌حساب
  function calculateSettlement() {
    if (trip && trip.expenses.length > 0) {
      const balances = trip.people.map((person) => {
        const totalPaid = trip.expenses
          .filter((expense) => expense.payer === person)
          .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

        const totalOwed = trip.expenses.reduce((acc, expense) => {
          if (expense.splitBetween.includes(person)) {
            return (
              acc + parseFloat(expense.amount) / expense.splitBetween.length
            );
          }
          return acc;
        }, 0);

        return {
          person,
          balance: totalPaid - totalOwed,
        };
      });

      setSettlement(balances);
      localStorage.setItem(`settlement_${tripId}`, JSON.stringify(balances));
    }
  }

  // به‌روزرسانی تریپ
  function updateTrip(updatedTrip) {
    const storedTrips = JSON.parse(localStorage.getItem('trips')) || [];
    const updatedTrips = storedTrips.map((t) =>
      t.id === updatedTrip.id ? updatedTrip : t,
    );
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
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
      alert('This person is already part of the trip.');
      return;
    }

    const updatedPeople = [...trip.people, newPerson.trim()];
    const updatedTrip = { ...trip, people: updatedPeople };
    updateTrip(updatedTrip);
    setNewPerson(''); // Reset the input field
  }

  // مدیریت انتخاب افراد برای تقسیم هزینه
  function handleSplitBetweenChange(person) {
    if (newExpense.splitBetween.includes(person)) {
      setNewExpense({
        ...newExpense,
        splitBetween: newExpense.splitBetween.filter((p) => p !== person),
      });
    } else {
      setNewExpense({
        ...newExpense,
        splitBetween: [...newExpense.splitBetween, person],
      });
    }
  }

  if (!trip) return <div>Loading...</div>;

  return (
    <div className="mb-14 mt-5 flex justify-between pr-32">
      <div className="w-1/3">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 rounded-xl border-2 border-stone-300 px-3 py-1 text-sm text-stone-600 transition-colors duration-300 hover:bg-stone-600 hover:text-white"
        >
          Back
        </button>
        <div>
          <h3 className="text-3xl font-bold text-stone-500">
            Trip: {trip.name}
          </h3>

          <h4 className="mt-8 text-xl font-semibold">People in this trip</h4>
          <h4 className="mb-3 mt-10 text-xl font-semibold">
            Add a new person to the trip
          </h4>
          <input
            type="text"
            value={newPerson}
            onChange={(e) => setNewPerson(e.target.value)}
            placeholder="Enter person's name"
            className="mr-2 rounded-md border-2 border-stone-200 bg-stone-100 px-3 py-0.5 focus:outline-none focus:ring-2 focus:ring-stone-500"
          />
          <button
            onClick={addPersonToTrip}
            className='className="rounded-md hover:bg-emerald-800" mb-6 rounded-lg bg-emerald-600 px-3 py-1 font-sans text-white transition-colors duration-200'
          >
            Add Person
          </button>
        </div>
        <div className="mb-5">
          <ul className="mt-3 space-y-1 divide-y border-b-2">
            {trip.people.map((person, index) => (
              <li key={index} className="flex justify-between space-x-3 py-2">
                <span className="rounded-xl bg-stone-100 px-4 py-1 text-center text-base text-emerald-600">
                  {person}
                </span>
                <button
                  onClick={() => removePersonFromTrip(person)}
                  className="rounded-xl bg-red-300 px-3 py-1 text-sm text-red-950 hover:bg-red-500 hover:opacity-80"
                >
                  Remove from trip
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* //---------------- */}
      <div className="w-1/3">
        <h4 className="mb-5 text-2xl font-bold text-stone-500">Add Expense</h4>
        <div className="flex gap-1">
          <select
            name="payer"
            value={newExpense.payer}
            onChange={(e) =>
              setNewExpense({ ...newExpense, payer: e.target.value })
            }
            className="mr-2 rounded-lg border-2 bg-stone-100 px-2 py-1 text-sm font-semibold"
          >
            <option value="">
              <span className="text-sm">Select Payer</span>
            </option>
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
            className="mr-2 rounded-md border-2 border-stone-200 bg-stone-100 px-3 py-0.5 focus:outline-none focus:ring-2 focus:ring-stone-500"
          />
          <input
            type="text"
            name="description"
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense({ ...newExpense, description: e.target.value })
            }
            placeholder="Description"
            className="mr-2 rounded-md border-2 border-stone-200 bg-stone-100 px-3 py-0.5 focus:outline-none focus:ring-2 focus:ring-stone-500"
          />
        </div>
        <h4 className="mt-5 text-xl font-semibold">
          Select people to split the expense
        </h4>
        <ul className="mt-5 space-y-1 divide-y">
          {trip.people.map((person, index) => (
            <li
              key={index}
              className="flex space-x-2 px-4 py-2 text-base text-emerald-600"
            >
              <input
                type="checkbox"
                checked={newExpense.splitBetween.includes(person)}
                onChange={() => handleSplitBetweenChange(person)}
                className="h-6 w-6 border border-emerald-400 accent-emerald-400 hover:cursor-pointer"
              />
              <span className="font-sans text-base font-semibold">
                {person}
              </span>
            </li>
          ))}
        </ul>

        <button
          onClick={addExpense}
          className="rounded-md bg-emerald-600 px-3 py-1 font-sans text-white transition-colors duration-200 hover:bg-emerald-800"
        >
          Add Expense
        </button>

        <h4 className="mb-3 mt-5 text-2xl font-bold text-stone-500">
          Expenses
        </h4>
        <ul className="divide-y-2">
          {trip.expenses.map((expense, index) => (
            <li key={index} className="space-y-2">
              <p>
                <span className="mr-2 text-xl font-semibold text-emerald-600">
                  {expense.payer}
                </span>
                paid
                <span className="mr-2 font-semibold text-red-700">
                  {' '}
                  ${expense.amount}
                </span>
                for
                <span className="ml-2 text-xl font-semibold text-stone-600">
                  {expense.description}
                </span>
              </p>

              <div className="">
                <p className="text-xl font-semibold text-stone-600">
                  Split between:
                  <span className="text-emerald-600">
                    {expense.splitBetween.join(', ')}
                  </span>
                </p>
                <button
                  onClick={() => removeExpense(index)}
                  className="mb-3 mt-2 rounded-xl bg-red-300 px-3 py-1 text-sm text-red-950 hover:bg-red-500 hover:opacity-80"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <h4 className="mb-3 mt-10 text-2xl font-bold text-stone-500">
          Total Expense Per Person: ${totalExpensePerPerson}
        </h4>
        <button
          onClick={calculateSettlement}
          className="rounded-md bg-emerald-600 px-3 py-1 font-sans text-white transition-colors duration-200 hover:bg-emerald-800"
        >
          Calculate Settlement
        </button>

        {settlement && (
          <div>
            <h4 className="mt-5 text-xl text-stone-600">Settlement</h4>
            <ul>
              {settlement.map((item, index) => (
                <li key={index}>
                  <p className="text-xl font-semibold text-stone-600">
                    <span className="text-emerald-600">{item.person} </span>
                    should
                    <span
                      className={
                        item.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }
                    >
                      {item.balance >= 0 ? ' receive' : ' pay'} $
                      {Math.abs(item.balance).toFixed(2)}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripDetail;
