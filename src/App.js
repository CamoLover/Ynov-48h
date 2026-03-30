import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './Main';
import AdminAuth from './AdminAuth';
import Admin from './Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/admin" element={<AdminAuth />} />
        <Route path="/admin/dashboard" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
