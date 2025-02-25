import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/singupandlogin/loging';
import Admin from './pages/admin/main/mainPage';
import NotFound from './pages/pageNotFound/pagenotfound';
import UserMain from './pages/user/main/userMain';
import Profile from './pages/user/cpmponent/profile/profile';
import SuccessPayment from './pages/user/cpmponent/successPaymentPayment/SuccessPayment';
import { jwtDecode } from 'jwt-decode';

function App() {
  return (
    <Router>  {/* Ensure Router wraps your entire app */}
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const isTokenExpired = (token) => {
    if (!token) return true; 
    
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; 
  
    return decodedToken.exp < currentTime; 
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token && isTokenExpired(token)) {
      //alert('Your session has expired. Please log in again.');
      navigate('/');
    } else {
      const role = localStorage.getItem('role');
      const currentPath = location.pathname; // Get the current path

      // Only navigate if the user is not already on a valid route
      if (role === 'Admin' && currentPath !== '/admin') {
        navigate('/admin');
      } else if (role === 'User' && currentPath !== '/User' && currentPath !== '/profile' && currentPath !== '/success') {
        navigate('/User');
      } else if (!role && currentPath !== '/') {
        navigate('/');
      }
    }
  }, [navigate, location]); // Add location to the dependency array

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/User" element={<UserMain />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/success" element={<SuccessPayment />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default App;