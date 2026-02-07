import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const SuccessModal = ({ isOpen, playerDetails, onClose }) => {
  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    const element = document.getElementById('ppl-receipt');
    
    try {
      // html2canvas settings to avoid oklch errors and improve quality
      const canvas = await html2canvas(element, {
        scale: 3, // High quality
        useCORS: true, // Photo loading fix
        backgroundColor: "#ffffff", // Background fix
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Center the receipt in PDF
      const xOffset = (pdf.internal.pageSize.getWidth() - pdfWidth) / 2;
      
      pdf.addImage(imgData, 'PNG', xOffset, 10, pdfWidth, pdfHeight);
      pdf.save(`PPL_Receipt_${playerDetails.playerName || 'Player'}.pdf`);
    } catch (error) {
      console.error("PDF Download Error:", error);
      alert("PDF download mein issue aa raha hai, please screenshot le lein.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="max-w-sm w-full animate-in zoom-in duration-300 my-auto">
        
        {/* Is section ko download karenge - Using standard Hex colors to prevent oklch error */}
        <div 
          id="ppl-receipt" 
          style={{ backgroundColor: '#ffffff', borderTop: '8px solid #1a237e' }} 
          className="rounded-3xl overflow-hidden shadow-2xl"
        >
          
          {/* Header - Manual colors for html2canvas compatibility */}
          <div style={{ backgroundColor: '#1a237e' }} className="p-5 text-center">
            <h2 style={{ color: '#ffffff' }} className="font-black text-xl italic uppercase">
              PPL SEASON 4.0
            </h2>
            <p style={{ color: '#fb923c' }} className="text-[10px] font-black tracking-[0.3em] uppercase mt-1">
              OFFICIAL RECEIPT
            </p>
          </div>

          <div className="p-6 flex flex-col items-center">
            {/* Player Photo with fallback */}
            <div style={{ border: '2px solid #dbeafe' }} className="w-24 h-24 rounded-xl p-1 mb-3 bg-[#f8fafc]">
              <img 
                src={playerDetails.photoUrl || "https://via.placeholder.com/150"} 
                alt="Player" 
                className="w-full h-full object-cover rounded-lg"
                crossOrigin="anonymous"
              />
            </div>

            <h3 style={{ color: '#111827' }} className="text-xl font-black uppercase text-center leading-tight">
              {playerDetails.playerName}
            </h3>
            <p style={{ color: '#2563eb' }} className="text-[10px] font-bold mb-4 tracking-widest uppercase italic">
              {playerDetails.role}
            </p>

            {/* Details Table */}
            <div style={{ borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }} className="w-full space-y-3 py-4 mb-4">
              <div className="flex justify-between items-center">
                <span style={{ color: '#64748b' }} className="text-[10px] font-bold uppercase tracking-wider">Father's Name</span>
                <span style={{ color: '#0f172a' }} className="text-sm font-bold uppercase">{playerDetails.fatherName}</span>
              </div>
              
              <div className="flex justify-between items-start">
                <span style={{ color: '#64748b' }} className="text-[10px] font-bold uppercase tracking-wider">Address</span>
                <div className="text-right">
                   <p style={{ color: '#0f172a' }} className="text-sm font-bold uppercase leading-none">{playerDetails.village}</p>
                   <p style={{ color: '#94a3b8' }} className="text-[9px] font-medium uppercase mt-1">{playerDetails.block}, {playerDetails.district}</p>
                </div>
              </div>


              {/* Status Box */}
              <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #e0f2fe' }} className="flex justify-between items-center p-2 rounded-lg">
                <span style={{ color: '#0369a1' }} className="text-[10px] font-black uppercase tracking-widest">Status</span>
                <span style={{ color: '#0c4a6e' }} className="text-[10px] font-black uppercase italic">Pending Verification</span>
              </div>
            </div>

            <p style={{ color: '#94a3b8' }} className="text-[9px] text-center italic leading-tight">
              Note: This is a system generated receipt. Final confirmation will be updated within 24 hours after verification.
            </p>
          </div>
        </div>

        {/* Footer Buttons (Ye PDF mein nahi aayenge) */}
        <div className="mt-5 flex flex-col gap-3 px-2">
          <button 
            onClick={handleDownloadPDF} 
            className="w-full bg-[#1a237e] text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 text-xs tracking-widest uppercase"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF Receipt
          </button>
          
          <button 
            onClick={onClose} 
            className="w-full text-white font-bold text-[11px] py-1 opacity-60 hover:opacity-100 transition uppercase tracking-[0.3em]"
          >
            Close / Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;