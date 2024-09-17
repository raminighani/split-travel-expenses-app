import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PeoplePage from "./pages/People";
import TripsPage from "./pages/Trips";
import TripDetailPage from "./pages/TripDetail";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route path="people" element={<PeoplePage />} />
          <Route path="trips" element={<TripsPage />} />
          <Route path="trips/:tripId" element={<TripDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
