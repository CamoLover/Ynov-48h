import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './Main';
import AdminAuth from './AdminAuth';
import Admin from './Admin';
import Archives from './Archives';
import Login from './Login';
import Fractal from './Fractal';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Main /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminAuth /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/archives" element={<ProtectedRoute><Archives /></ProtectedRoute>} />
          <Route path="/fractal" element={<ProtectedRoute><Fractal /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
