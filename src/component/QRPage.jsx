import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const QRPage = () => {
  const navigate = useNavigate();

  // Yahan apna UPI ID aur Amount daal dena
  const upiId = "9770395871@ibl"; 
  const amount = "500"; // Jo bhi fees ho
  
  // GPay/PhonePe direct open karne ke liye link (Optional)
  const upiLink = `upi://pay?pa=${upiId}&pn=PPL_SEASON_4&am=${amount}&cu=INR`;

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-orange-500">
        
        {/* Top Header */}
        <div className="bg-[#1e293b] p-6 text-center">
          <h1 className="text-white text-2xl font-black italic tracking-tighter">
            PPL SEASON <span className="text-orange-500">4.0</span>
          </h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
            Official Registration Gateway
          </p>
        </div>

        <div className="p-8 flex flex-col items-center text-center">
          <div className="mb-4">
            <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-4 py-1 rounded-full uppercase">
              Entry Fee: ₹{amount}
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Scan QR to Pay
          </h2>

          {/* QR Code Frame */}
          <div className="relative p-4 bg-white border-2 border-dashed border-slate-200 rounded-3xl mb-6 group transition-all hover:border-orange-500">
            {/* Aap apna QR image yahan 'src' mein daal dena */}
            <img 
              src={assets.QRPPL} 
              alt="Payment QR" 
              className="w-56 h-56 object-contain"
            />
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-2xl"></div>
          </div>

          <div className="space-y-2 mb-8">
            <p className="text-sm font-bold text-slate-600">UPI ID: <span className="text-blue-600">{upiId}</span></p>
            <p className="text-[10px] text-red-500 font-bold leading-tight uppercase">
              * Payment karne ke baad <span className="underline italic">Screenshot</span> zaroor le lein!
            </p>
          </div>

          {/* Proceed Button */}
          <button 
            onClick={() => navigate('/register')}
            className="w-full bg-[#1e293b] hover:bg-orange-600 text-white py-5 rounded-2xl font-black tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 group"
          >
            I HAVE PAID — FILL FORM
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <p className="mt-6 text-[9px] text-gray-400 font-medium uppercase tracking-tighter">
            Security Verified by PPL Management Team
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRPage;
