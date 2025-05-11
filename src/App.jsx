import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import AdminDashboard from './AdminDashboard';
import SellerDashboard from './SellerDashboard';
import UserDashboard from './UserDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
