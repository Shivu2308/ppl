import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    // Yahan config/headers KI ZAROORAT NAHI HAI ❌
    const res = await axios.post(`${API_URL}/admin/login`, credentials);
    
    if (res.data.success) {
      // Yahan se aapko token MIL RAHA HAI
      localStorage.setItem('adminToken', res.data.token);
      navigate('/ppl-admin-secret-2026');
    }
  } catch (err) {
    alert("Login Fail!");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a237e] px-4">
      {/* Login Card */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-t-8 border-orange-500">
        <div className="p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black italic tracking-tighter text-[#1a237e]">
              PPL ADMIN <span className="text-orange-500">LOGIN</span>
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase mt-2 tracking-widest">
              Season 4.0 Management Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-black text-gray-500 mb-2 uppercase ml-1">Admin Username</label>
              <input
                type="text"
                name="username"
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-bold"
                placeholder="Enter Username"
                onChange={handleChange}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-black text-gray-500 mb-2 uppercase ml-1">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-bold"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-white tracking-widest transition-all shadow-lg shadow-orange-200 uppercase 
                ${loading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600 active:scale-95'}`}
            >
              {loading ? 'VERIFYING...' : 'ENTER DASHBOARD'}
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-400 font-bold italic">
              Authorized Personnel Only. All access is logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;