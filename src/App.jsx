import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import PlayerForm from './component/PlayerForm';
import Home from './component/Home';
import Header from './component/Header';
import PlayerList from './component/PlayerList';
import AdminDashboard from './component/AdminDashboard';
import AdminLogin from './component/AdminLogin';
import QRPage from './component/QRPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route 
            path="/ppl-admin-secret-2026" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/pay-to-register" element={<QRPage />} />
          <Route path="/register" element={<PlayerForm />} />
          <Route path="/players-list-ppl" element={<PlayerList />} />
        </Routes>
      </div>
    </Router>
  );
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    // Agar token nahi hai toh Login page par bhejo
    return <Navigate to="/admin-login" replace />;
  }
  
  return children;
};

export default App;