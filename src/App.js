import './App.css';
import Login from './pages/singupandlogin/loging';
import Admin from './pages/admin/main/mainPage';
import NotFound from './pages/pageNotFound/pagenotfound'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
