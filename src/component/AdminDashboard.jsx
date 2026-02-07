import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [players, setPlayers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/ppl-control-room-2026');
      return;
    }
    fetchPlayers();
  }, [activeTab]);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${API_URL}/admin/list/${activeTab}`, config);
      console.log(res.data.players)
      setPlayers(res.data.players);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/ppl-control-room-2026');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredPlayers = players.filter(player =>
    player.aadharNumber?.includes(searchTerm) ||
    player.playerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken'); // Token nikaala
      const config = {
        headers: { Authorization: `Bearer ${token}` } // Middleware ise hi check karega
      };

      // URL check karein: /api/admin/status/ (Ya jo bhi aapka base URL ho)
      await axios.put(`${API_URL}/admin/approve/${id}`,
        { status: newStatus }, // Ye status controller mein req.body.status banega
        config
      );

      alert(`Success: Player is now ${newStatus}!`);
      fetchPlayers();
    } catch (err) {
      console.error(err);
      alert("something went wrong!");
    }
  };

  const exportToExcel = () => {
  // 1. Data prepare karein (Wahi dikhayenge jo Excel mein chahiye)
  const excelData = filteredPlayers.map(p => ({
    "Player Name": p.playerName,
    "Father's Name": p.fatherName,
    "Mobile": p.mobileNumber,
    "Village": p.village,
    "Block": p.block,
    "District": p.district,
    "Aadhar Number": p.aadharNumber,
    "Role": p.role,
    "Batting": `${p.battingHand} (${p.battingPosition})`,
    "Bowling": `${p.bowlingHand} - ${p.bowlingType}`,
    "UTR Number": p.utrNumber,
    "Status": p.status.toUpperCase()
  }));

  // 2. Workbook banayein
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "PPL_S4_Players");

  // 3. File download karayein
  XLSX.writeFile(workbook, `PPL_S4_Squad_List_${activeTab}.xlsx`);
};

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-6 font-sans">
      <div className="max-w-[1600px] mx-auto">

        {/* Header Section */}
        {/* Header Section (Modified) */}
<div className="bg-white p-5 rounded-3xl shadow-sm mb-6 flex flex-col lg:flex-row justify-between items-center gap-4">
  <h1 className="text-2xl font-black text-blue-900 italic uppercase">PPL S4 Admin Panel</h1>
  
  <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-center">
    <input
      type="text"
      placeholder="Search..."
      className="flex-1 lg:w-64 bg-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    
    {/* Naya Export Button */}
    <button 
      onClick={exportToExcel}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-black text-[10px] flex items-center gap-2 transition shadow-lg shadow-blue-200"
    >
      📥 EXPORT EXCEL
    </button>

    <div className="flex bg-gray-100 p-1 rounded-xl">
      <button onClick={() => setActiveTab('pending')} className={`px-4 py-1.5 rounded-lg font-bold text-[10px] ${activeTab === 'pending' ? 'bg-orange-500 text-white' : 'text-gray-400'}`}>PENDING</button>
      <button onClick={() => setActiveTab('approved')} className={`px-4 py-1.5 rounded-lg font-bold text-[10px] ${activeTab === 'approved' ? 'bg-green-600 text-white' : 'text-gray-400'}`}>REGISTERED</button>
    </div>
  </div>
</div>

        {/* Master Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1200px]">
              <thead className="bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-5">Photo</th>
                  <th className="px-6 py-5">Player Personal Details</th>
                  <th className="px-6 py-5">Aadhar Info</th>
                  <th className="px-6 py-5">Role & Style</th>
                  <th className="px-6 py-5">Payment</th>
                  <th className="px-6 py-5 text-center">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr><td colSpan="6" className="p-20 text-center font-bold text-gray-300 animate-pulse uppercase">Loading Master List...</td></tr>
                ) : filteredPlayers.map((player) => (
                  <tr key={player._id} className="hover:bg-blue-50/50 transition">

                    {/* 1. Photo (Clickable) */}
                    <td className="px-6 py-4 text-center">
                      <a href={player.playerPhoto} target="_blank" rel="noreferrer">
                        <img src={player.playerPhoto} className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-100 hover:scale-110 transition shadow-sm" alt="Player" />
                      </a>
                    </td>

                    {/* 2. Personal Details Stack */}
                    <td className="px-6 py-4 space-y-1">
                      <p className="font-black text-slate-900 uppercase italic text-base leading-none">{player.playerName}</p>
                      <p className="text-[11px] font-bold text-slate-500 uppercase">S/O: {player.fatherName}</p>
                      <p className="text-[11px] font-bold text-blue-600">📅 DOB: {player.dob}</p>
                      <p className="text-[11px] font-bold text-green-700 font-mono">📞 {player.mobileNumber}</p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase leading-tight italic max-w-[200px]">
                        📍 {player.village}, {player.block}, {player.district}
                      </p>
                    </td>

                    {/* 3. Aadhar Number & Link */}
                    <td className="px-6 py-4">
                      <p className="font-mono font-black text-slate-700 text-xs mb-1">{player.aadharNumber}</p>
                      <a href={player.aadharPhoto} target="_blank" rel="noreferrer" className="text-[10px] font-black text-blue-500 hover:underline uppercase tracking-tighter">View Aadhar Card ↗</a>
                    </td>

                    {/* 4. Role, Order & Playing Style */}
                    <td className="px-6 py-4">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 inline-block min-w-[150px]">
                        {/* Role Name */}
                        <p className="text-[11px] font-black text-slate-900 uppercase underline decoration-blue-400 mb-1">
                          {player.role}
                        </p>

                        {/* Condition 1: Batsman ya Wicket Keeper Batsman */}
                        {(player.role === 'Batsman' || player.role === 'Wicket Keeper') && (
                          <>
                            <p className="text-[10px] font-bold text-slate-500">{player.battingHand}</p>
                            <p className="text-[10px] font-bold text-slate-500">Order: {player.battingPosition}</p>
                          </>
                        )}

                        {/* Condition 2: Bowler */}
                        {player.role === 'Bowler' && (
                          <>
                            <p className="text-[10px] font-bold text-slate-500">{player.bowlingHand}</p>
                            <p className="text-[10px] font-bold text-slate-500">Bowling Style: {player.bowlingType}</p>
                          </>
                        )}

                        {/* Condition 3: All Rounder */}
                        {player.role === 'Allrounder' && (
                          <>
                            <p className="text-[10px] font-bold text-slate-600 font-black italic">{player.battingHand}</p>
                            <p className="text-[10px] font-bold text-slate-500"> {player.battingPosition}</p>
                            <p className="text-[10px] font-bold text-slate-500">Bowling Style:: {player.bowlingType}</p>
                          </>
                        )}
                      </div>
                    </td>

                    {/* 5. Payment Screenshot & UTR */}
                    <td className="px-6 py-4">
                      <a href={player.paymentScreenshot} target="_blank" rel="noreferrer" className="text-[10px] font-black text-orange-400 hover:underline uppercase flex items-center gap-1">
                        View Receipt ↗
                      </a>
                    </td>

                    {/* 6. Status & Actions */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col gap-2">
                        {activeTab === 'pending' ? (
                          <>
                            <button onClick={() => handleUpdateStatus(player._id, 'approved')} className="bg-green-600 text-white py-2 rounded-xl font-black text-[9px] tracking-widest hover:bg-green-700 transition shadow-sm">ACCEPT ✅</button>
                            <button onClick={() => handleUpdateStatus(player._id, 'rejected')} className="bg-red-50 text-red-500 py-2 rounded-xl font-black text-[9px] tracking-widest hover:bg-red-500 hover:text-white border border-red-100 transition">REJECT ❌</button>
                          </>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-green-600 text-[10px] font-black uppercase italic">Registered ✓</span>
                            <button onClick={() => handleUpdateStatus(player._id, 'pending')} className="block w-full text-[8px] text-slate-300 underline hover:text-orange-500 uppercase font-black">Reset</button>
                          </div>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;