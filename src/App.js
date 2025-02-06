import './App.css';
import Login from './pages/singupandlogin/loging';
import Admin from './pages/admin/main/mainPage';
import NotFound from './pages/pageNotFound/pagenotfound'
import UserMain from './pages/user/main/userMain';
import Profile from './pages/user/cpmponent/profile/profile'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
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
  
  const isTokenExpired = (token) => {
    if (!token) return true; 
    
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; 
  
    return decodedToken.exp < currentTime; 
  };


  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token && isTokenExpired(token)) {
      alert('Your session has expired. Please log in again.');
      navigate('/');
    }
    else{
    const role = localStorage.getItem('role');
    if (role === 'Admin') {
      navigate('/admin');
    } else if (role === 'User') {
      navigate('/User');
    } else {
      navigate('/');
    }
  }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/User" element={<UserMain />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
