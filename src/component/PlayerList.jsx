import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPublicPlayers = async () => {
      try {
        const res = await axios.get(`${API_URL}/players/public-list`);
        setPlayers(res.data.players);
      } catch (err) {
        console.error("Data load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicPlayers();
  }, [API_URL]);

  const filteredPlayers = players.filter(player =>
    player.playerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.village?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.district?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-6 font-sans">
      <div className="max-w-[1600px] mx-auto">

        {/* Header Section - Same as Admin */}
        <div className="bg-white p-5 rounded-3xl shadow-sm mb-6 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-blue-900 italic uppercase leading-none">PPL S4 Squads</h1>
            <span className="text-orange-600 font-bold text-[10px] tracking-widest uppercase mt-1">Season 4.0 Official Registered Players</span>
          </div>
          
          <div className="flex gap-3 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search Name, Village or District..."
              className="flex-1 lg:w-96 bg-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </div>
        </div>

        {/* Master Table - Exact Admin Style */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1100px]">
              <thead className="bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-5">Player Profile</th>
                  <th className="px-6 py-5">Personal Details</th>
                  <th className="px-6 py-5">Address</th>
                  <th className="px-6 py-5">Role</th>
                  <th className="px-6 py-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-20 text-center font-bold text-gray-400 animate-pulse uppercase tracking-widest">
                      Loading Registered Stars... 🏏
                    </td>
                  </tr>
                ) : filteredPlayers.map((player) => (
                  <tr key={player._id} className="hover:bg-blue-50/50 transition duration-200">
                    
                    {/* 1. Photo (Admin Style) */}
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <img 
                          src={player.playerPhoto} 
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-100 shadow-sm" 
                          alt="PPL Player" 
                        />

                      </div>
                    </td>

                    {/* 2. Player Personal Details (Admin Stack Style) */}
                    <td className="px-6 py-4 space-y-1">
                     <p className="font-black text-slate-900 uppercase italic text-base leading-none">{player.playerName}</p>
                      <p className="text-[11px] font-bold text-slate-500 uppercase">S/O: {player.fatherName}</p>
                    </td>

                    {/* 3. Origin Details */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-700 uppercase leading-none italic">📍 {player.village}</p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase mt-1">
                        {player.block}, {player.district}
                      </p>
                    </td>

                    {/* 4. Role & Style (Admin Condition Logic) */}
                    <td className="px-6 py-4">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 inline-block min-w-[120px] lg:min-w-[180px]">
                        <p className="text-[11px] font-black text-slate-900 uppercase underline decoration-blue-400 mb-1">
                          {player.role}
                        </p>
                        
                        {/* Batting / WK Details */}
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
                            <p className="text-[10px] font-bold text-slate-500">Bowling Type: {player.bowlingType}</p>
                          </>
                        )}

                        {/* Condition 3: All Rounder */}
                        {player.role === 'Allrounder' && (
                          <>
                            <p className="text-[10px] font-bold text-slate-600 font-black italic">{player.battingHand}</p>
                            <p className="text-[10px] font-bold text-slate-500">Order: {player.battingPosition}</p>
                            <p className="text-[10px] font-bold text-slate-500">Bowling Type: {player.bowlingType}</p>
                          </>
                        )}
                      </div>
                    </td>

                    {/* 5. Status Badge */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="bg-green-600 text-white px-4 py-1.5 rounded-xl font-black text-[9px] tracking-widest shadow-sm">
                          REGISTERED ✓
                        </span>
                        <p className="text-[8px] text-slate-300 uppercase mt-1 font-bold">Official Entry</p>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {!loading && filteredPlayers.length === 0 && (
          <div className="mt-20 text-center">
            <p className="text-gray-400 font-black uppercase italic tracking-[0.3em] text-xl">No Stars Found</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default PlayerList;