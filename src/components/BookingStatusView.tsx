import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, Compass, ShieldCheck, Mail, Phone, 
  Clock, CheckCircle, XCircle, FileText, AlertCircle, RefreshCw,
  Sparkles, ArrowLeft, Upload, Landmark, MessageSquare
} from 'lucide-react';
import { formatRupiah, formatDisplayDate } from '../utils';

interface BookingStatusViewProps {
  setView: (view: string) => void;
  initialInvoiceId?: string;
}

export default function BookingStatusView({ setView, initialInvoiceId = '' }: BookingStatusViewProps) {
  const [invoiceId, setInvoiceId] = useState(initialInvoiceId);
  const [searched, setSearched] = useState(false);
  const [booking, setBooking] = useState<any | null>(null);
  const [reUploadOpen, setReUploadOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedReceiptName, setUploadedReceiptName] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-search if an initial invoice ID is passed
  useEffect(() => {
    if (initialInvoiceId) {
      handleSearchInvoice(initialInvoiceId);
    }
  }, [initialInvoiceId]);

  const handleSearchInvoice = (idToSearch?: string) => {
    setError('');
    const targetId = (idToSearch || invoiceId).trim().toUpperCase();
    if (!targetId) {
      setError('Silakan masukkan nomor invoice.');
      return;
    }

    try {
      const stored = localStorage.getItem('casa_dream_bookings');
      const list = stored ? JSON.parse(stored) : [];
      const match = list.find((b: any) => b.invoiceNumber.toUpperCase() === targetId);

      if (match) {
        setBooking(match);
        setSearched(true);
      } else {
        setBooking(null);
        setSearched(true);
        setError(`Nomor invoice "${targetId}" tidak ditemukan. Silakan periksa kembali.`);
      }
    } catch (err) {
      console.error(err);
      setError('Gagal membaca database lokal.');
    }
  };

  const handleReUploadReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedReceiptName) {
      alert('Silakan unggah bukti transfer yang baru.');
      return;
    }

    setUploadLoading(true);

    setTimeout(() => {
      try {
        const stored = localStorage.getItem('casa_dream_bookings');
        const list = stored ? JSON.parse(stored) : [];
        const updatedList = list.map((b: any) => {
          if (b.invoiceNumber === booking.invoiceNumber) {
            return {
              ...b,
              status: 'pending', // Reset back to pending review
              paymentReceiptName: uploadedReceiptName,
              adminNotes: '', // Clear previous rejection notes
              updatedAt: new Date().toISOString()
            };
          }
          return b;
        });

        localStorage.setItem('casa_dream_bookings', JSON.stringify(updatedList));
        
        // Update local state
        const updatedBooking = updatedList.find((b: any) => b.invoiceNumber === booking.invoiceNumber);
        setBooking(updatedBooking);
        setReUploadOpen(false);
        setUploadedReceiptName('');
        setUploadedFile(null);
        alert('Bukti pembayaran Anda yang baru telah sukses diunggah. Tim concierge kami akan segera memverifikasinya kembali!');
      } catch (err) {
        alert('Gagal memperbarui data.');
      } finally {
        setUploadLoading(false);
      }
    }, 1500);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      setUploadedReceiptName(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setUploadedReceiptName(file.name);
    }
  };

  // Status visual elements builder
  const getTimelineSteps = (currentStatus: string) => {
    const steps = [
      { key: 'created', label: 'Reservasi Dibuat', desc: 'Detail pesanan tersimpan' },
      { key: 'pending', label: 'Review Pembayaran', desc: 'Pembayaran sedang diverifikasi staf' },
      { key: 'confirmed', label: 'Terkonfirmasi', desc: 'Villa dijamin untuk kedatangan Anda' },
      { key: 'checked_in', label: 'Sedang Menginap', desc: 'Welcome to Casa Dream Sanctuary' },
      { key: 'checked_out', label: 'Selesai', desc: 'Terima kasih atas kunjungan Anda' }
    ];

    // Map current status to step index
    let activeStepIdx = 0;
    if (currentStatus === 'pending') activeStepIdx = 1;
    else if (currentStatus === 'confirmed') activeStepIdx = 2;
    else if (currentStatus === 'checked_in') activeStepIdx = 3;
    else if (currentStatus === 'checked_out') activeStepIdx = 4;
    else if (currentStatus === 'cancelled') activeStepIdx = 1; // display rejection at review stage

    return { steps, activeStepIdx };
  };

  const { steps, activeStepIdx } = booking ? getTimelineSteps(booking.status) : { steps: [], activeStepIdx: 0 };

  return (
    <div id="booking-status-view" className="bg-[#FFF8F5] text-[#1E1B18] py-16 px-6 md:px-12 min-h-[85vh]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D3C4B9]/30">
          <div className="space-y-1">
            <button
              onClick={() => setView('home')}
              className="text-[#62462b] hover:text-[#7c5d41] font-semibold text-xs uppercase tracking-wider flex items-center space-x-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </button>
            <h1 className="font-serif text-3xl tracking-tight text-gray-900 font-semibold">Cek Status Reservasi</h1>
            <p className="text-xs text-gray-500 font-light">Masukkan nomor invoice Anda untuk melacak status approval, check-in, dan logistik villa secara real-time.</p>
          </div>
          
          {/* Quick Search Widget */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="e.g. CASA-2026-8841"
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchInvoice()}
                className="bg-white border border-[#D3C4B9]/40 text-xs py-2.5 pl-9 pr-4 rounded-md focus:outline-none focus:border-[#62462b] w-48 md:w-64 font-mono"
              />
            </div>
            <button
              onClick={() => handleSearchInvoice()}
              className="px-4 py-2.5 bg-[#62462b] hover:bg-[#7c5d41] text-white text-xs font-semibold uppercase tracking-wider rounded-md shadow-sm transition-colors cursor-pointer"
            >
              Cari
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. INITIAL EMPTY STATE */}
        {!searched && !booking && (
          <div className="bg-white p-12 rounded-2xl border border-[#D3C4B9]/30 text-center space-y-6 shadow-md">
            <div className="w-16 h-16 rounded-full bg-[#62462b]/5 text-[#62462b] flex items-center justify-center mx-auto">
              <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="font-serif text-lg font-semibold text-gray-800">Menanti Nomor Registrasi</h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Nomor invoice (contoh: <strong className="font-mono">CASA-2026-8841</strong>) dapat Anda temukan pada layar konfirmasi setelah Anda mengunggah bukti bayar di halaman checkout.
              </p>
            </div>
            
            <div className="p-4 bg-[#FAF1E6]/40 rounded-lg max-w-lg mx-auto border border-[#D3C4B9]/20 text-left space-y-3">
              <span className="text-[10px] uppercase font-bold text-[#62462b] tracking-wider block">Kredensial Reservasi Default Demo:</span>
              <p className="text-[11px] text-[#81756c] font-light">Gunakan nomor invoice berikut untuk menguji status aliran backend lokal:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] font-mono text-center">
                <button onClick={() => { setInvoiceId('CASA-2026-8841'); handleSearchInvoice('CASA-2026-8841'); }} className="bg-white p-2 border border-gray-100 rounded hover:border-[#62462b] transition-all font-semibold">CASA-2026-8841 (Review)</button>
                <button onClick={() => { setInvoiceId('CASA-2026-5592'); handleSearchInvoice('CASA-2026-5592'); }} className="bg-white p-2 border border-gray-100 rounded hover:border-[#62462b] transition-all font-semibold">CASA-2026-5592 (Confirmed)</button>
                <button onClick={() => { setInvoiceId('CASA-2026-9041'); handleSearchInvoice('CASA-2026-9041'); }} className="bg-white p-2 border border-gray-100 rounded hover:border-[#62462b] transition-all font-semibold">CASA-2026-9041 (Staying)</button>
                <button onClick={() => { setInvoiceId('CASA-2026-3112'); handleSearchInvoice('CASA-2026-3112'); }} className="bg-white p-2 border border-gray-100 rounded hover:border-[#62462b] transition-all font-semibold">CASA-2026-3112 (Checked-out)</button>
              </div>
            </div>
          </div>
        )}

        {/* 2. BOOKING DETAILS MAIN PANEL */}
        {searched && booking && (
          <div className="space-y-8">
            
            {/* Live Status Banner */}
            <div className={`p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm ${
              booking.status === 'pending' ? 'bg-amber-50/50 border-amber-200' :
              booking.status === 'confirmed' ? 'bg-green-50/50 border-green-200' :
              booking.status === 'checked_in' ? 'bg-blue-50/50 border-blue-200' :
              booking.status === 'checked_out' ? 'bg-gray-50 border-gray-200' :
              'bg-red-50/50 border-red-200'
            }`}>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">Invoice Number</span>
                <h3 className="font-mono text-xl font-bold text-gray-900">{booking.invoiceNumber}</h3>
                <p className="text-xs text-gray-500 font-light">
                  Didaftarkan atas nama <strong className="text-gray-800 font-medium">{booking.guestName}</strong>
                </p>
              </div>

              <div className="text-left md:text-right">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-semibold">Status Reservasi</span>
                <span className={`inline-block px-3 py-1.5 border text-xs font-bold uppercase tracking-wider rounded-sm mt-1.5 ${
                  booking.status === 'pending' ? 'bg-amber-100 border-amber-300 text-amber-800' :
                  booking.status === 'confirmed' ? 'bg-green-100 border-green-300 text-green-800 animate-pulse' :
                  booking.status === 'checked_in' ? 'bg-blue-100 border-blue-300 text-blue-800' :
                  booking.status === 'checked_out' ? 'bg-gray-200 border-gray-300 text-gray-700' :
                  'bg-red-100 border-red-300 text-red-800'
                }`}>
                  {booking.status === 'pending' && 'Review Pembayaran'}
                  {booking.status === 'confirmed' && 'Pembayaran Disetujui'}
                  {booking.status === 'checked_in' && 'Sedang Menginap (Staying)'}
                  {booking.status === 'checked_out' && 'Selesai Menginap'}
                  {booking.status === 'cancelled' && 'Dibatalkan / Perlu Koreksi'}
                </span>
              </div>
            </div>

            {/* Rejection Notification & Interactive Re-upload Button */}
            {booking.status === 'cancelled' && (
              <div className="bg-red-50 p-6 rounded-2xl border border-red-200 space-y-4 shadow-sm">
                <div className="flex items-start space-x-3">
                  <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-gray-900 text-sm">Pembayaran Ditolak atau Perlu Koreksi</h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-light">
                      Catatan staf kami: <strong className="text-red-700 font-medium">{booking.adminNotes || 'Bukti bayar tidak terbaca dengan jelas atau nominal transfer tidak sesuai.'}</strong>
                    </p>
                    <p className="text-xs text-gray-500 font-light">
                      Jangan khawatir! Anda dapat mengunggah ulang bukti pembayaran Anda langsung melalui tombol di bawah ini agar staf concierge kami dapat meninjau ulang pesanan Anda.
                    </p>
                  </div>
                </div>

                {!reUploadOpen ? (
                  <button
                    onClick={() => setReUploadOpen(true)}
                    className="w-full py-3 bg-[#62462b] hover:bg-[#7c5d41] text-white text-xs font-semibold tracking-wider uppercase rounded-md shadow flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Unggah Bukti Bayar Baru</span>
                  </button>
                ) : (
                  <form onSubmit={handleReUploadReceipt} className="bg-white p-5 rounded-xl border border-red-100 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">Unggah Bukti Baru (Foto/Screenshot)</label>
                      <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="border-2 border-dashed border-[#D3C4B9] rounded-lg p-6 text-center cursor-pointer hover:border-[#62462b] transition-all bg-[#FAF8F5]"
                      >
                        <input
                          type="file"
                          id="re-upload-file-picker"
                          accept="image/*,application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label htmlFor="re-upload-file-picker" className="cursor-pointer block space-y-2">
                          <Upload className="w-8 h-8 text-[#62462b]/60 mx-auto" />
                          <p className="text-xs text-gray-700 font-medium">Klik atau seret foto bukti transfer di sini</p>
                          <p className="text-[10px] text-gray-400">JPEG, PNG, atau PDF max 5MB</p>
                        </label>
                      </div>

                      {uploadedReceiptName && (
                        <div className="p-3 bg-green-50 text-green-700 text-[11px] rounded flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 shrink-0 text-green-600" />
                          <span>Terpilih: <strong>{uploadedReceiptName}</strong></span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => { setReUploadOpen(false); setUploadedReceiptName(''); }}
                        className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-xs font-semibold uppercase tracking-wider rounded"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={uploadLoading}
                        className="flex-1 py-2.5 bg-[#62462b] hover:bg-[#7c5d41] text-white text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center space-x-1.5"
                      >
                        {uploadLoading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>MENGUNGGAH...</span>
                          </>
                        ) : (
                          <span>Kirim Bukti Pembayaran</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Visual Timeline Tracking */}
            {booking.status !== 'cancelled' && (
              <div className="bg-white p-8 rounded-2xl border border-[#D3C4B9]/30 shadow-md space-y-6">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Reservation Progress Tracker</span>
                
                {/* Horizontal Timeline */}
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
                  {/* Background progress bar line */}
                  <div className="absolute left-[15px] top-[15px] bottom-[15px] md:bottom-auto md:left-[10%] md:right-[10%] md:top-4 h-full md:h-[2px] bg-gray-100 -z-0" />
                  
                  {/* Completed progress bar line overlay */}
                  <div 
                    className="absolute left-[15px] top-[15px] bottom-auto md:bottom-auto md:left-[10%] md:top-4 h-2/3 md:h-[2px] bg-[#62462b] -z-0 transition-all duration-700" 
                    style={{
                      width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${(activeStepIdx / (steps.length - 1)) * 80}%` : '2px',
                      height: typeof window !== 'undefined' && window.innerWidth < 768 ? `${(activeStepIdx / (steps.length - 1)) * 80}%` : 'auto'
                    }}
                  />

                  {steps.map((step, idx) => {
                    const isCompleted = idx <= activeStepIdx;
                    const isCurrent = idx === activeStepIdx;

                    return (
                      <div key={step.key} className="flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center relative z-10 w-full md:w-[20%]">
                        {/* Bullet */}
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-[#62462b] border-[#62462b] text-white font-bold' 
                            : 'bg-white border-gray-200 text-gray-300'
                        } ${isCurrent ? 'ring-4 ring-[#62462b]/20 scale-110' : ''}`}>
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <span className="text-xs font-mono">{idx + 1}</span>
                          )}
                        </div>

                        {/* Text labels */}
                        <div className="space-y-0.5">
                          <strong className={`text-xs block ${isCurrent ? 'text-[#62462b] font-semibold' : 'text-gray-800 font-medium'}`}>
                            {step.label}
                          </strong>
                          <span className="text-[10px] text-gray-400 block font-light leading-snug">
                            {step.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Split layout: Stay Details & Invoice Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Stay Info Card */}
              <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-[#D3C4B9]/30 shadow-sm space-y-6">
                <h4 className="font-serif font-bold text-[#62462b] text-sm border-b border-gray-100 pb-1 flex items-center">
                  <Landmark className="w-4 h-4 mr-1 text-[#62462b]" /> Sanctuary Stay Details
                </h4>

                <div className="space-y-4 text-xs">
                  {/* Suite Selection name */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Suite Terpilih</span>
                    <strong className="text-gray-900 font-serif text-sm font-semibold">{booking.suiteName}</strong>
                    <span className="text-[10px] text-gray-400 block font-light">Tugu Utara, Kec. Cisarua, Kabupaten Bogor, Jawa Barat</span>
                  </div>

                  {/* Check-In / Check-Out */}
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Check-In</span>
                      <strong className="text-gray-800 text-xs font-mono">{booking.checkIn}</strong>
                      <span className="text-[10px] text-gray-400 block font-light">Dari pukul 14:00 WIB</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Check-Out</span>
                      <strong className="text-gray-800 text-xs font-mono">{booking.checkOut}</strong>
                      <span className="text-[10px] text-gray-400 block font-light">Sebelum pukul 12:00 WIB</span>
                    </div>
                  </div>

                  {/* Guests and Stay Nights */}
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Durasi</span>
                      <strong className="text-gray-800 font-semibold">{booking.totalNights} Malam</strong>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Kapasitas</span>
                      <strong className="text-gray-800 font-semibold">{booking.guests} Tamu Terdaftar</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing & Verification Logs */}
              <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-[#D3C4B9]/30 shadow-sm space-y-6">
                <h4 className="font-serif font-bold text-[#62462b] text-sm border-b border-gray-100 pb-1 flex items-center">
                  <FileText className="w-4 h-4 mr-1 text-[#62462b]" /> Ringkasan Biaya & Billing
                </h4>

                <div className="space-y-3.5 text-xs">
                  {/* Stay Cost Calculation */}
                  <div className="flex justify-between items-center text-gray-600 font-light">
                    <span>Biaya Kamar ({booking.totalNights} Malam)</span>
                    <span className="font-medium text-gray-800">{formatRupiah(booking.baseRateTotal)}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600 font-light">
                    <span>Cleaning & Concierge Service Fee</span>
                    <span className="font-medium text-gray-800">{formatRupiah(booking.serviceCleaningFee || 250000)}</span>
                  </div>

                  <hr className="border-gray-100 my-2" />

                  {/* Total Payment Amount */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-gray-900">Total Settlement</span>
                    <strong className="text-gray-900 text-base font-serif font-bold">{formatRupiah(booking.totalAmount)}</strong>
                  </div>

                  {/* Payment Metadata details */}
                  <div className="bg-[#FAF8F5] p-3 rounded-lg border border-gray-100 text-[10px] font-mono space-y-1">
                    <div className="flex justify-between text-gray-400">
                      <span>METODE:</span>
                      <strong className="text-gray-600 uppercase font-sans font-bold">{booking.paymentMethod === 'qris' ? 'QRIS RAPID' : 'BANK TRANSFER'}</strong>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>BUKTI:</span>
                      <strong className="text-gray-600 break-all text-right max-w-[150px]" title={booking.paymentReceiptName}>{booking.paymentReceiptName || 'Manual Override'}</strong>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>REGISTERED:</span>
                      <strong className="text-gray-500 text-[9px]">{booking.createdAt ? booking.createdAt.substring(0, 10) + ' ' + booking.createdAt.substring(11, 16) : 'Real-Time Sync'}</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Assistance Section */}
            <div className="bg-[#FAF1E6]/40 p-6 rounded-2xl border border-[#D3C4B9]/30 space-y-3.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#62462b] uppercase tracking-wider">
                <MessageSquare className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>Butuh Bantuan Mendesak?</span>
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Staf concierge kami siap melayani Anda 24 jam untuk pengurusan reschedule, check-in awal, atau permintaan butler khusus. Hubungi Hotline kami di bawah:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-gray-700 font-medium">
                <a href="tel:+6281244556677" className="flex items-center bg-white p-3 border border-gray-100 rounded-lg hover:border-[#62462b] transition-all">
                  <Phone className="w-4 h-4 text-[#62462b] mr-2" />
                  <span>Telepon Resort: +62 812-4455-6677</span>
                </a>
                <a href="mailto:concierge@casadream.luxury" className="flex items-center bg-white p-3 border border-gray-100 rounded-lg hover:border-[#62462b] transition-all">
                  <Mail className="w-4 h-4 text-[#62462b] mr-2" />
                  <span>Email Butler: concierge@casadream.luxury</span>
                </a>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
