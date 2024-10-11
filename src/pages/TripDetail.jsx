import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faPlus,
  faTrashCan,
  faPenToSquare,
  faXmark,
  faEllipsisVertical,
  faCodeFork,
  faCalendar,
  faClock,
  faDollarSign,
} from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function TripDetail() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  // const [expenseDate, setExpenseDate] = useState(null);

  const [newExpense, setNewExpense] = useState({
    payer: '',
    amount: '',
    description: '',
    splitBetween: [],
    time: '',
    date: '',
    // People who the expense will be split between
  });
  const [totalExpensePerPerson, setTotalExpensePerPerson] = useState(null);
  const [settlement, setSettlement] = useState(null);
  const [newPerson, setNewPerson] = useState(''); // Input state for new person
  const [totalExpense, setTotalExpense] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchres, setSearchRes] = useState('');

  useEffect(() => {
    if (trip && trip.expenses) {
      calculateSettlement();
    }
  }, [trip]);
  useEffect(() => {
    const storedTrips = JSON.parse(localStorage.getItem('trips')) || [];
    const foundTrip = storedTrips.find((t) => t.id === parseInt(tripId));
    setTrip(foundTrip);

    // const expenseDate =
    //   JSON.parse(localStorage.getItem(`expensedate_${tripId}`)) || [];
    // setExpenseDate(expenseDate);

    const expenseDetail =
      JSON.parse(localStorage.getItem(`expensedetail_${tripId}`)) || [];
    setTotalExpense(expenseDetail);

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
      selectedDate &&
      newExpense.splitBetween.length > 0
    ) {
      const month = selectedDate.getMonth() + 1; // ماه از 0 شروع می‌شود
      const day = selectedDate.getDate();
      const year = selectedDate.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;

      const updatedExpenses = [
        ...(trip.expenses || []),
        { ...newExpense, date: formattedDate },
      ];
      const updatedTrip = { ...trip, expenses: updatedExpenses };
      // localStorage.setItem(
      //   `expensedate_${tripId}`,
      //   JSON.stringify(formattedDate),
      // );
      updateTrip(updatedTrip);
      calculateTotalExpense(updatedTrip);
      setSelectedDate(null);
      setIsOpen(false);
      setNewExpense({
        payer: '',
        amount: '',
        description: '',
        splitBetween: [],
        time: '',
      });
    }
  }

  function updateTrip(updatedTrip) {
    const storedTrips = JSON.parse(localStorage.getItem('trips')) || [];
    const updatedTrips = storedTrips.map((t) =>
      t.id === updatedTrip.id ? updatedTrip : t,
    );
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
    setTrip(updatedTrip);
  }

  // محاسبه هزینه کل برای هر نفر
  function calculateTotalExpense(updatedTrip) {
    const total = updatedTrip.expenses.reduce(
      (acc, curr) => acc + parseFloat(curr.amount),

      0,
    );

    const perPerson = total / updatedTrip.people.length;
    setTotalExpensePerPerson(perPerson.toFixed(2));

    const expenseDetail = {
      per: perPerson,
      all: total,
    };
    localStorage.setItem(
      `expensedetail_${tripId}`,
      JSON.stringify(expenseDetail),
    );

    setTotalExpense(expenseDetail);
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

  function handleIsOpen() {
    setIsOpen(!isOpen);
  }

  const filteredPeopleName = trip?.people?.filter((person) =>
    person.toLowerCase().includes(searchres.toLowerCase()),
  );

  if (!trip) return <div>Loading...</div>;

  return (
    <div className="mb-14 mt-5 flex flex-col justify-between px-6 pr-32">
      <div className="mb-5 flex justify-center">
        <div className="w-[1128px]">
          <button
            onClick={() => navigate(-1)}
            className="mb-5 rounded-xl border-2 border-stone-300 px-3 py-1 text-sm text-stone-600 transition-colors duration-300 hover:bg-stone-600 hover:text-white"
          >
            Back
          </button>
          <div>
            <p className="text-[32px] font-[500] leading-[48px] text-[#141414]">
              Trip: {trip.name}
            </p>

            {/* <h4 className="mt-8 text-xl font-semibold">People in this trip</h4>
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
          </button> */}
          </div>
        </div>
      </div>

      {/* Trip Details-----------------------------------------------------------------------------------------------------  */}
      <div className="flex justify-center">
        <div className="flex h-[463px] w-[1128px] justify-center rounded-[20px] bg-[#A3CFBB] px-8 py-8">
          <div className="span w-[35%] space-y-10 border-b-[1px] border-[#E9ECEF] text-[16px] font-bold">
            <p className="h-[36px] border-b-[1px] border-[#E9ECEF] pl-4 text-[14px] font-normal text-[#6C757D]">
              Specifications
            </p>
            <p>
              Start date :<span> {trip.date}</span>
            </p>
            <p>
              People number : <span>{trip.people?.length}</span>
            </p>
            <p>
              Total expenses : <span>${totalExpense?.all}</span>
            </p>
            <p>
              Averag expense per person : <span>${totalExpense?.per}</span>
            </p>
            <p>
              Number of expenses : <span>{trip.expenses?.length}</span>
            </p>
          </div>
          <div className="w-[70%] border-b-[1px] border-l-[1px] border-[#E9ECEF]">
            <p className="h-[36px] border-b-[1px] border-[#E9ECEF] pl-4 text-[14px] font-normal text-[#6C757D]">
              PERSONS
            </p>
            <ul className="custom-scrollbar h-[328px] space-y-1 overflow-y-auto">
              {trip.people.map((person, index) => (
                <li
                  key={index}
                  className="flex h-[56px] items-center justify-between space-x-3 px-4 py-2 odd:bg-gray-100"
                >
                  <span className="rounded-xl px-4 py-1 text-center text-base">
                    {person}
                  </span>
                  <button
                    onClick={() => removePersonFromTrip(person)}
                    className="h-[40px] w-[40px] rounded-lg border-[1px] border-[#CED4DA] bg-white hover:opacity-80"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Trip Details-----------------------------------------------------------------------------------------------------  */}

      {/* Expense Add && list -----------------------------------------------------------------------------------------------------*/}
      <div className="mt-14">
        <div id="add-title" className="flex items-center justify-center">
          <div className="flex w-[1128px] justify-between">
            <div className="text-[32px] font-medium text-[#141414]">
              <p>Expenses</p>
            </div>
            <div className="item-center flex space-x-[6px]">
              <div className="relative">
                <span>
                  <input
                    className="h-[40px] rounded-lg border-[1px] border-[#ADB5BD] px-7"
                    type="text"
                    placeholder="Search "
                  />
                  <span className="absolute bottom-[13px] left-[10px] text-[14px] text-[#9ca3bc]">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </span>
                </span>
              </div>
              <div className="flex h-[40px] items-center justify-center rounded-[8px] bg-[#051B11] text-white">
                <button
                  onClick={handleIsOpen}
                  className="h-[40px] w-[80px] space-x-1 px-2"
                >
                  <span>
                    <FontAwesomeIcon icon={faPlus} />
                  </span>
                  <span>NEW</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div id="list-expense" className="mt-7 flex justify-center">
          <div className="h-[350px] w-[1128px] rounded-[20px] bg-[#A3CFBB] px-[32px] py-8">
            <ul className="custom-scrollbar h-[280px] overflow-y-auto">
              {trip.expenses.map((expense, index) => (
                <li
                  key={index}
                  className="flex h-[56px] items-center justify-between px-4 py-2 odd:bg-gray-100"
                >
                  <p className="w-[25%] text-[16px] font-medium">
                    {expense.description}
                  </p>
                  <p className="w-[25%] text-[16px] font-medium">
                    {expense.payer}
                  </p>

                  <p className="w-[25%] text-[16px] font-medium">
                    {expense?.date}
                  </p>

                  <p className="w-[25%] text-[16px] font-medium">
                    ${expense.amount}
                  </p>

                  <button
                    onClick={() => removeExpense(index)}
                    className="h-[40px] w-[40px] rounded-lg border-[1px] border-[#CED4DA] bg-white"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Expense Add && list End -----------------------------------------------------------------------------------------------------*/}

      {/* popup */}
      {isOpen && (
        <div className="popup">
          <div className="flex h-[730px] w-[544px] flex-col space-y-1 rounded-xl bg-white">
            <div className="ml-3 mt-3 flex items-center justify-between space-x-2 pl-3 pr-8 pt-2">
              <div className="flex items-center justify-center space-x-2">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[28px] bg-wgrn">
                  <div className="flex h-[35px] w-[35px] items-center justify-center rounded-[28px] bg-tablegren">
                    <FontAwesomeIcon icon={faCodeFork} className="text-white" />
                  </div>
                </div>
                <p className="text-[18px] font-[600]">Create trip</p>
              </div>
              <div>
                <button onClick={handleIsOpen}>
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="h-[22px] w-[22px]"
                  />
                </button>
              </div>
            </div>
            <div className="flex h-[80%] w-[544px] flex-col items-center justify-between space-y-4">
              <div className="input space-y-3">
                <div className="mt-4">
                  <label>Title</label>
                  <input
                    type="text"
                    name="description"
                    value={newExpense.description}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        description: e.target.value,
                      })
                    }
                    placeholder="Description"
                    className="mr-2 w-full rounded-md border-2 border-stone-200 bg-stone-100 px-3 py-0.5 focus:outline-none focus:ring-2 focus:ring-stone-500"
                  />
                </div>
                <div className="flex justify-between space-x-2">
                  <div className="input relative flex flex-col">
                    <label>Date</label>
                    {/* <input
                      type="text"
                      value={newExpense.date}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, date: e.target.value })
                      }
                    /> */}
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      dateFormat="MM/dd/yyyy"
                      placeholderText="select a date"
                      className="pl-[30px]"
                    />
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="absolute bottom-[12px] left-[10px] text-[#a2a8b4]"
                    />
                  </div>
                  <div className="input relative flex flex-col">
                    <label>Time</label>
                    <input
                      type="text"
                      value={newExpense.time}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, time: e.target.value })
                      }
                      className="pl-[30px]"
                    />
                    <FontAwesomeIcon
                      icon={faClock}
                      className="absolute bottom-[12px] left-[10px] text-[#a2a8b4]"
                    />
                  </div>
                </div>
                <div>
                  <label>Price</label>
                  <div className="flex items-center">
                    <span className="flex h-[38px] w-[50px] items-center justify-center rounded-l-md border-[1px] text-[#198754]">
                      <FontAwesomeIcon icon={faDollarSign} />
                    </span>
                    <input
                      type="number"
                      name="amount"
                      value={newExpense.amount}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, amount: e.target.value })
                      }
                      placeholder="Amount"
                      className="mr-2 w-full !rounded-l-none !rounded-r-md border-2 border-stone-200 bg-stone-100 px-3 py-0.5 focus:outline-none focus:ring-2 focus:ring-stone-500"
                    />
                  </div>
                </div>
                <div>
                  <label>Spender</label>
                  <select
                    name="payer"
                    value={newExpense.payer}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, payer: e.target.value })
                    }
                    className="mr-2 w-full rounded-lg border-2 px-2 py-1 text-sm font-[500]"
                  >
                    <option value="">Select Payer</option>
                    {trip.people.map((person, index) => (
                      <option key={index} value={person}>
                        {person}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ul className="custom-scrollbar mt-5 flex h-[200px] w-[478px] flex-col overflow-y-auto rounded-lg border-[1px]">
                <div className="relative flex items-center justify-center">
                  <input
                    value={searchres}
                    onChange={(e) => setSearchRes(e.target.value)}
                    type="text"
                    placeholder="Search..."
                    className="h-[40px] w-[478px] rounded-l-lg border-[1px] border-stone-200 bg-white px-3 py-0.5 pl-6 text-[14px] focus:outline-none focus:ring-1 focus:ring-stone-200"
                  />
                  <span className="absolute bottom-[10px] left-[10px] text-[12px] text-[#9ca3bc]">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </span>
                </div>
                <p className="text-center">
                  {filteredPeopleName.length === 0 && 'no resault'}
                </p>
                {searchres.length < 3 &&
                  trip.people.map((person, index) => (
                    <li key={index} className="px-4 py-1 text-base">
                      <label
                        className={`flex cursor-pointer items-center justify-between rounded-[4px] px-6 py-1 ${newExpense.splitBetween.includes(person) && 'bg-[#D1E7DD]'}`}
                      >
                        <span className="font-sans text-[14px] font-[500] text-[#344054]">
                          {person}
                        </span>
                        <input
                          type="checkbox"
                          checked={newExpense.splitBetween.includes(person)}
                          onChange={() => handleSplitBetweenChange(person)}
                          className="h-6 w-6 border border-emerald-400 accent-emerald-400 hover:cursor-pointer"
                        />
                      </label>
                    </li>
                  ))}
                {searchres.length >= 3 &&
                  filteredPeopleName.map((person, index) => (
                    <li key={index} className="px-4 py-2 text-base">
                      <label className={`flex cursor-pointer justify-between`}>
                        <span className="font-sans text-[14px] font-[500] text-[#344054]">
                          {person}
                        </span>
                        <input
                          type="checkbox"
                          checked={newExpense.splitBetween.includes(person)}
                          onChange={() => handleSplitBetweenChange(person)}
                          className="h-6 w-6 border border-emerald-400 accent-emerald-400 hover:cursor-pointer"
                        />
                      </label>
                    </li>
                  ))}
              </ul>

              <div className="flex h-[44px] w-[368px] items-center justify-center">
                <button
                  onClick={addExpense}
                  className="mb-2 h-[44px] w-[128px] rounded-md bg-emerald-600 px-3 py-1 font-sans text-white transition-colors duration-200 hover:bg-emerald-800"
                >
                  create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* popup End */}
      {/* New Setelment */}
      <div className="mt-14">
        <div className="flex justify-center">
          <div className="w-[1128px]">
            <p className="mb-10 px-2 text-[32px] font-medium">
              Debtors & Creditors
            </p>
            <div className="rounded-[20px] bg-[#A3CFBB] px-8 py-8">
              <div>
                <p className="mb-5 text-[32px] font-medium">Jack</p>
              </div>
              <div className="flex justify-between">
                <div className="w-[50%]">
                  <p className="h-[36px] px-5 text-[12px] font-medium text-[#6C757D]">
                    Share
                  </p>
                  <ul className="custom-scrollbar h-[350px] overflow-y-auto">
                    {trip.expenses.map((expense, index) => (
                      <li
                        key={index}
                        className="flex h-[56px] items-center px-5 odd:bg-gray-100"
                      >
                        <p>{expense.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="w-[50%] border-l-[1px] border-[#E9ECEF]">
                  <p className="h-[36px] px-5 text-[12px] font-medium text-[#6C757D]">
                    Creditors
                  </p>
                  <ul className="custom-scrollbar h-[350px] overflow-y-auto">
                    {settlement?.map((item, index) => (
                      <li
                        key={index}
                        className="flex h-[56px] items-center justify-between px-5 odd:bg-gray-100"
                      >
                        <p>{item.person}</p>
                        <p
                          className={
                            item.balance >= 0
                              ? 'text-emerald-600'
                              : 'text-red-600'
                          }
                        >
                          {trip.expenses.length > 0 &&
                            Math.abs(item.balance).toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* New Setelment End */}

      {/* //---------------------------------------------------------------------------------------------------------------------------

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
              {trip.expenses.length > 0 &&
                settlement.map((item, index) => (
                  <li key={index}>
                    <p className="text-xl font-semibold text-stone-600">
                      <span className="text-emerald-600">{item.person} </span>
                      should
                      <span
                        className={
                          item.balance >= 0
                            ? 'text-emerald-600'
                            : 'text-red-600'
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
      </div> */}
    </div>
  );
}

export default TripDetail;
