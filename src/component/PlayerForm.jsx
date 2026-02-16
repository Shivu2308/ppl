import React, { useState } from 'react';
import axios from 'axios';
import SuccessModal from './SuccessModal';
import { useNavigate } from 'react-router-dom';

const PlayerForm = () => {
  const [formData, setFormData] = useState({
    playerName: '', fatherName: '', dob: '', aadharNumber: '',
    mobileNumber: '', village: '', block: '', district: '',
    role: '', battingHand: '', battingPosition: '',
    bowlingHand: '', bowlingType: ''
  });

  const navigate = useNavigate();

  const [playerPhoto, setPlayerPhoto] = useState(null);
  const [aadharPhoto, setAadharPhoto] = useState(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null); // Naya field

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [registeredData, setRegisteredData] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      const file = e.target.files[0];
      if (e.target.name === 'playerPhoto') setPlayerPhoto(file);
      if (e.target.name === 'aadharPhoto') setAadharPhoto(file);
      if (e.target.name === 'paymentScreenshot') setPaymentScreenshot(file);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!playerPhoto || !aadharPhoto || !paymentScreenshot) {
      alert("Bhai, teeno photos (Photo, Aadhar, Screenshot) zaroori hain!");
      return;
    }

    setLoading(true);

    try {
      const finalData = new FormData();

      // Text data append
      Object.keys(formData).forEach(key => {
        finalData.append(key, formData[key] || "N/A");
      });

      // Files append (As per your Backend Controller names)
      finalData.append('playerPhoto', playerPhoto);
      finalData.append('aadharPhoto', aadharPhoto);
      finalData.append('paymentScreenshot', paymentScreenshot);

      const res = await axios.post(`${API_URL}/players/register`, finalData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setRegisteredData({
          playerName: formData.playerName,
          fatherName: formData.fatherName,
          role: formData.role,
          village: formData.village,
          district: formData.district,
          block: formData.block,
          photoUrl: URL.createObjectURL(playerPhoto)
        });
        setShowModal(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration Fail ho gaya! Check UTR or Aadhar.");
    } finally {
      setLoading(false);
    }
  };

  // UI Components
  const inputClass = "w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block transition";
  const labelClass = "block mb-2 text-sm font-medium text-gray-700";
  return (
    <>
      <div className="min-h-screen bg-gray-100 py-8 px-4 font-sans">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-blue-800 uppercase tracking-tighter italic">
              PPL Season 4.0
            </h2>
            <p className="text-gray-500 font-medium">Official Player Registration Portal</p>
          </div>

          <form
            {/* onSubmit={handleSubmit} */}
            className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Player Name</label>
                <input type="text" name="playerName" className={inputClass} placeholder="Enter full name" onChange={handleChange} required />
              </div>
              <div>
                <label className={labelClass}>Father's Name</label>
                <input type="text" name="fatherName" className={inputClass} placeholder="Father's name" onChange={handleChange} required />
              </div>
              <div>
                <label className={labelClass}>Date of Birth</label>
                <input type="text" name="dob" className={inputClass} placeholder="DD/MM/YY" onChange={handleChange} required />
              </div>
              <div>
                <label className={labelClass}>Aadhar Number</label>
                <input type="text" name="aadharNumber" className={inputClass} placeholder="12 Digit Aadhar" maxLength="12" onChange={handleChange} required />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Mobile Number (WhatsApp)</label>
                <input type="tel" name="mobileNumber" className={inputClass} placeholder="Active phone number" onChange={handleChange} required />
              </div>
            </div>

            {/* Address Details */}
            <div className="p-5 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="text-xs font-black text-blue-700 mb-4 uppercase">Area Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" name="village" placeholder="Village" className={inputClass} onChange={handleChange} required />
                <input type="text" name="block" placeholder="Block" className={inputClass} onChange={handleChange} required />
                <input type="text" name="district" placeholder="District" className={inputClass} onChange={handleChange} required />
              </div>
            </div>

            {/* Player Role */}
            <div>
              <label className="block mb-3 text-lg font-bold text-gray-800 text-center">Your Specialty</label>
              <select
                name="role"
                value={formData.role} // State se bind kar diya
                className="w-full p-4 bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-800 transition cursor-pointer outline-none"
                onChange={handleChange}
                required
              >
                {/* Value khali rakhi hai, isliye 'required' ise rok lega */}
                <option value="">-- Click to Select Your Role --</option>
                <option value="Wicket Keeper">Wicket Keeper-Batsman</option>
                <option value="Batsman">Pure Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="Allrounder">All-Rounder</option>
              </select>
            </div>
            {/* Conditional Attributes */}
            <div className="animate-fade-in">
              {(formData.role === 'Batsman' || formData.role === 'Allrounder' || formData.role === 'Wicket Keeper') && (
                <div className="p-4 mb-4 border-l-8 border-yellow-400 bg-yellow-50 rounded-r-xl">
                  <h4 className="font-bold text-yellow-900 text-sm mb-3">BATTING STYLE</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <select name="battingHand" className={inputClass} onChange={handleChange} required>
                      <option value="">Select Hand</option>
                      <option value="Right Hand">Right Hand</option>
                      <option value="Left Hand">Left Hand</option>
                    </select>
                    <select name="battingPosition" className={inputClass} onChange={handleChange} required>
                      <option value="">Order</option>
                      <option value="Opener">Opener</option>
                      <option value="Middle Order">Middle Order</option>
                      <option value="Finisher">Finisher</option>
                    </select>
                  </div>
                </div>
              )}

              {(formData.role === 'Bowler' || formData.role === 'Allrounder') && (
                <div className="p-4 border-l-8 border-green-500 bg-green-50 rounded-r-xl">
                  <h4 className="font-bold text-green-900 text-sm mb-3">BOWLING STYLE</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <select name="bowlingHand" className={inputClass} onChange={handleChange} required>
                      <option value="">Select Hand</option>
                      <option value="Right Hand">Right Hand</option>
                      <option value="Left Hand">Left Hand</option>
                    </select>
                    <select name="bowlingType" className={inputClass} onChange={handleChange} required>
                      <option value="">Type</option>
                      <option value="Fast">Fast Pace</option>
                      <option value="Medium">Medium</option>
                      <option value="Off Spin">Off Spin</option>
                      <option value="Leg Spin">Leg Spin</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Photo Uploads */}
            {/* Photo Uploads Section - Mobile Friendly */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <h3 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-[0.2em] text-center">Required Documents</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                {/* Player Photo */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase">Passport Photo</label>
                  <div className="relative">
                    <input type="file" name="playerPhoto" accept="image/*" onChange={handleChange} required className="hidden" id="pPhoto" />
                    <label htmlFor="pPhoto" className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 active:bg-blue-50 transition overflow-hidden">
                      <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded shadow-sm flex-shrink-0">BROWSE</span>
                      <span className="text-[11px] text-gray-500 truncate flex-1 font-medium">
                        {playerPhoto ? playerPhoto.name : "Select Photo"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Aadhar Photo */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase">Aadhar Card</label>
                  <div className="relative">
                    <input type="file" name="aadharPhoto" accept="image/*" onChange={handleChange} required className="hidden" id="aPhoto" />
                    <label htmlFor="aPhoto" className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 active:bg-blue-50 transition overflow-hidden">
                      <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded shadow-sm flex-shrink-0">BROWSE</span>
                      <span className="text-[11px] text-gray-500 truncate flex-1 font-medium">
                        {aadharPhoto ? aadharPhoto.name : "Select Aadhar"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Payment Screenshot (Full Width) */}
                <div className="md:col-span-2 space-y-1 mt-1">
                  <label className="text-[10px] font-bold text-orange-700 ml-1 uppercase">Payment Proof</label>
                  <div className="relative">
                    <input type="file" name="paymentScreenshot" accept="image/*" onChange={handleChange} required className="hidden" id="sPhoto" />
                    <label htmlFor="sPhoto" className="flex items-center gap-3 px-3 py-3 bg-orange-50 border-2 border-orange-200 border-dashed rounded-xl cursor-pointer hover:bg-orange-100 transition overflow-hidden">
                      <span className="bg-orange-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-md flex-shrink-0">UPLOAD</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-orange-900 truncate">
                          {paymentScreenshot ? paymentScreenshot.name : "Click to add Screenshot"}
                        </p>
                        {!paymentScreenshot && <p className="text-[9px] text-orange-600 font-medium">Transaction ID must be visible</p>}
                      </div>
                    </label>
                  </div>
                </div>

              </div>
            </div>

            
            {/* Final Payment Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-700'} text-white font-black py-5 px-4 rounded-2xl shadow-xl uppercase tracking-widest text-lg`}
            >
              {loading ? 'Uploading Data...' : 'Submit Registration'}
            </button>
          </form>
        </div>
      </div>



      {showModal && registeredData && (
        <SuccessModal
          isOpen={showModal}
          playerDetails={registeredData}
          onClose={() => {
            setShowModal(false);
            // navigate(0); // Ye refresh ka behtar option hai React Router mein
            // YA FIR
            navigate('/'); // Direct home page par bhejne ke liye
          }}
        />
      )}
    </>
  );
};

export default PlayerForm;
