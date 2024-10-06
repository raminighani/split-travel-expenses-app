import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import People from './pages/People';
import Trips from './pages/Trips';
import TripDetail from './pages/TripDetail';
import Home from './components/Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route path="" element={<People />} />
          <Route path="/" element={<Home />} />
          <Route path="trips" element={<Trips />} />
          <Route path="trips/:tripId" element={<TripDetail />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
