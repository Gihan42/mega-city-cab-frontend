import './App.css';
import Login from './pages/singupandlogin/loging';
import Admin from './pages/admin/main/mainPage';
import NotFound from './pages/pageNotFound/pagenotfound'
import UserMain from './pages/user/main/userMain';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/User" element={<UserMain />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
