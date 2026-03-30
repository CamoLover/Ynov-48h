import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './Main';
import AdminAuth from './AdminAuth';
import Admin from './Admin';
import Archives from './Archives';
import Login from './Login';
import Fractal from './Fractal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminAuth />} />
        <Route path="/admin/dashboard" element={<Admin />} />
        <Route path="/archives" element={<Archives />} />
        <Route path="/fractal" element={<Fractal />} />
      </Routes>
    </Router>
  );
}

export default App;
