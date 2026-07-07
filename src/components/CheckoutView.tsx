import React, { useState, useRef } from 'react';
import { ShieldCheck, Upload, FileText, CheckCircle2, QrCode, AlertCircle, Sparkles, Building, Phone, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { formatRupiah } from '../utils';

interface CheckoutViewProps {
  tempBooking: any;
  setView: (view: string) => void;
  setFinalBooking: (booking: any) => void;
}

export default function CheckoutView({ tempBooking, setView, setFinalBooking }: CheckoutViewProps) {
  // Redirect back if no suite chosen
  if (!tempBooking) {
    return (
      <div className="text-center py-24 px-6 max-w-xl mx-auto space-y-4">
        <AlertCircle className="w-12 h-12 text-[#B89F88] mx-auto animate-pulse" />
        <h2 className="font-serif text-2xl font-semibold">No Suite Selected</h2>
        <p className="text-sm text-gray-500 font-light">Please select your preferred suite from our collections page first before proceeding to checkout.</p>
        <button
          onClick={() => setView('home')}
          className="px-6 py-2.5 bg-[#1A1A1A] text-white uppercase text-xs tracking-widest rounded-sm hover:bg-[#B89F88]"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Guest Information state
  const [fullName, setFullName] = useState('Bambang Wijaya');
  const [email, setEmail] = useState('bambang.wijaya@gmail.com');
  const [phone, setPhone] = useState('+62 812-3456-7890');

  // Payment Method state
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'qris'>('qris');

  // Receipt upload state
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      });
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Form submit handler
  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setFormError('Please complete all guest information fields.');
      return;
    }

    if (!uploadedFile) {
      setFormError('Please upload a copy of your bank transfer or QRIS payment proof.');
      return;
    }

    setSubmitting(true);

    // Simulate validation and API request
    setTimeout(() => {
      const randomInvoice = 'CASA-2026-' + Math.floor(1000 + Math.random() * 9000);
      const finalBookingObj = {
        ...tempBooking,
        guestName: fullName,
        guestEmail: email,
        guestPhone: phone,
        paymentMethod: paymentMethod,
        paymentReceiptName: uploadedFile.name,
        invoiceNumber: randomInvoice,
        status: 'pending', // Starts as pending review for admin approval flow
        createdAt: new Date().toISOString()
      };

      // Persist to localStorage for Admin Dashboard synchronization
      try {
        const stored = localStorage.getItem('casa_dream_bookings');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(finalBookingObj);
        localStorage.setItem('casa_dream_bookings', JSON.stringify(list));
      } catch (err) {
        console.error("Error writing booking to local storage", err);
      }

      setFinalBooking(finalBookingObj);
      setSubmitting(false);
      setView('confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  return (
    <div id="checkout-view" className="bg-[#FFF8F5] text-[#1E1B18] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Intro */}
        <div className="text-center md:text-left space-y-2 mb-12 border-b border-gray-100 pb-6">
          <span className="text-xs uppercase tracking-[0.3em] text-[#62462b] font-semibold">Secure Your Stay</span>
          <h1 className="font-serif text-3xl md:text-5xl tracking-tight text-gray-900">Reservation Details</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light">Complete your journey and reserve your Indonesian-inspired quiet sanctuary.</p>
        </div>

        {/* Layout: Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Multi-Step Checkout Form */}
          <form onSubmit={handleConfirmReservation} className="lg:col-span-7 space-y-10">
            
            {/* Step 1: Guest Information */}
            <section className="bg-white p-6 md:p-8 rounded-lg border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-[#62462b] text-white flex items-center justify-center font-serif text-sm font-semibold">1</div>
                <div>
                  <h3 className="font-serif text-base font-semibold tracking-wide text-gray-900">Guest Information</h3>
                  <p className="text-[10px] text-gray-400">Add the primary guest details for check-in verification</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Primary Guest Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Bambang Wijaya"
                    className="w-full bg-[#FAF8F5] border border-gray-200 text-xs py-3 px-4 rounded-md focus:outline-none focus:border-[#62462b] transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. guest@domain.com"
                    className="w-full bg-[#FAF8F5] border border-gray-200 text-xs py-3 px-4 rounded-md focus:outline-none focus:border-[#62462b] transition-colors"
                  />
                </div>

                {/* Phone WhatsApp */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">WhatsApp Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +62 812-3456-7890"
                      className="w-full bg-[#FAF8F5] border border-gray-200 text-xs py-3 pl-10 pr-4 rounded-md focus:outline-none focus:border-[#62462b] transition-colors"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2: Payment Method Selection */}
            <section className="bg-white p-6 md:p-8 rounded-lg border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-[#62462b] text-white flex items-center justify-center font-serif text-sm font-semibold">2</div>
                <div>
                  <h3 className="font-serif text-base font-semibold tracking-wide text-gray-900">Choose Settlement Method</h3>
                  <p className="text-[10px] text-gray-400">Direct instant transfer options with secure gateway confirmation</p>
                </div>
              </div>

              {/* Selection cards */}
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-4 rounded-md border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-2 ${
                    paymentMethod === 'qris' 
                      ? 'bg-[#62462b]/10 border-[#62462b] text-gray-900' 
                      : 'border-gray-200 text-gray-400 bg-white hover:bg-[#FAF8F5]'
                  }`}
                >
                  <QrCode className={`w-6 h-6 ${paymentMethod === 'qris' ? 'text-[#62462b]' : 'text-gray-400'}`} />
                  <span className="text-xs uppercase tracking-[0.1em] font-semibold">QRIS RAPID</span>
                  <span className="text-[9px] text-gray-400 leading-none">Instant QR Scan</span>
                </div>

                <div 
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-4 rounded-md border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-2 ${
                    paymentMethod === 'bank_transfer' 
                      ? 'bg-[#62462b]/10 border-[#62462b] text-gray-900' 
                      : 'border-gray-200 text-gray-400 bg-white hover:bg-[#FAF8F5]'
                  }`}
                >
                  <Building className={`w-6 h-6 ${paymentMethod === 'bank_transfer' ? 'text-[#62462b]' : 'text-gray-400'}`} />
                  <span className="text-xs uppercase tracking-[0.1em] font-semibold">BANK TRANSFER</span>
                  <span className="text-[9px] text-gray-400 leading-none">Manual Direct EFT</span>
                </div>
              </div>

              {/* Details of chosen payment method */}
              <div className="p-5 bg-gray-50 border border-gray-100 rounded-md">
                {paymentMethod === 'qris' ? (
                  <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="bg-white p-3 rounded border border-gray-100 shadow-sm shrink-0 flex flex-col items-center">
                      <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-sm relative">
                        {/* Dynamic QR Code mockup */}
                        <div className="absolute inset-2 border border-gray-400 flex flex-col justify-between items-center p-1">
                          <div className="flex justify-between w-full">
                            <div className="w-5 h-5 border-2 border-black bg-black" />
                            <div className="w-5 h-5 border-2 border-black bg-black" />
                          </div>
                          <span className="text-[9px] font-mono tracking-widest text-gray-400">QRIS</span>
                          <div className="flex justify-between w-full">
                            <div className="w-5 h-5 border-2 border-black bg-black" />
                            <div className="w-5 h-5 border border-black" />
                          </div>
                        </div>
                      </div>
                      <span className="text-[8px] tracking-widest text-[#62462b] uppercase mt-1.5 font-bold">CASA-DREAM-VILLA.QRIS</span>
                    </div>
                    <div className="space-y-2 text-xs text-gray-600 font-light">
                      <h4 className="font-serif font-semibold text-gray-900 text-sm flex items-center">
                        <Sparkles className="w-4 h-4 mr-1 text-[#62462b]" /> Instant QRIS Auto-Processing
                      </h4>
                      <p className="leading-relaxed">
                        1. Scan the QR code using any Indonesian banking application (BCA Mobile, Livin, Octo) or e-wallet (GoPay, OVO, ShopeePay, Dana).
                      </p>
                      <p className="leading-relaxed">
                        2. Verify the recipient displays as <strong className="text-gray-900">CASA DREAM SANCTUARY</strong>.
                      </p>
                      <p className="leading-relaxed">
                        3. Complete the transaction of <strong className="text-gray-900">{formatRupiah(tempBooking.totalAmount)}</strong>, take a screenshot of your success page, and upload below.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs text-gray-600 font-light">
                    <h4 className="font-serif font-semibold text-gray-900 text-sm">Direct Bank Accounts Details</h4>
                    <p className="leading-relaxed">
                      Please transfer the exact amount of <strong className="text-gray-900">{formatRupiah(tempBooking.totalAmount)}</strong> to one of our private boutique resort accounts:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <span className="text-[9px] text-gray-400 block font-semibold uppercase">BCA (Bank Central Asia)</span>
                        <strong className="text-gray-800 tracking-wider">8812 0049 221</strong>
                        <span className="text-[9px] text-gray-500 block">PT. Casa Dream Sanctuary</span>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <span className="text-[9px] text-gray-400 block font-semibold uppercase">Mandiri</span>
                        <strong className="text-gray-800 tracking-wider">131-00-2024-881</strong>
                        <span className="text-[9px] text-gray-500 block">PT. Casa Dream Sanctuary</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 italic">
                      Catatan: Transfer dengan jumlah nominal yang tepat sesuai rincian agar sistem otomatis melakukan verifikasi secara instan dalam hitungan menit.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Step 3: Upload Proof of Payment */}
            <section className="bg-white p-6 md:p-8 rounded-lg border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-[#62462b] text-white flex items-center justify-center font-serif text-sm font-semibold">3</div>
                <div>
                  <h3 className="font-serif text-base font-semibold tracking-wide text-gray-900">Upload Settlement Proof</h3>
                  <p className="text-[10px] text-gray-400">Drag & drop or select your bank transfer or QRIS scan receipt</p>
                </div>
              </div>

              {/* Dropzone Container */}
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
                  dragActive 
                    ? 'border-[#62462b] bg-[#62462b]/10' 
                    : uploadedFile 
                      ? 'border-green-300 bg-green-50/30' 
                      : 'border-gray-200 hover:border-[#62462b] hover:bg-gray-50'
                }`}
              >
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="hidden" 
                />

                {uploadedFile ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-900">{uploadedFile.name}</p>
                      <p className="text-[10px] text-gray-400">{uploadedFile.size}</p>
                    </div>
                    <span className="text-[10px] text-[#62462b] underline font-medium">Change uploaded file</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="font-semibold text-gray-800">Drag and drop file here, or click to browse</p>
                      <p className="text-gray-400 font-light">Supports JPG, PNG, PDF formats up to 5MB</p>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Submit Section (Errors & Confirm Button) */}
            <div className="space-y-4">
              {formError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-md text-xs flex items-center space-x-2.5">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span className="font-medium">{formError}</span>
                </div>
              )}

              {/* Progress process detail checklist below form */}
              <div className="p-5 bg-white border border-gray-100 rounded-lg space-y-4 text-xs font-light text-gray-600">
                <h4 className="font-serif font-semibold text-gray-800 text-sm">Your Booking Process</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <h5 className="font-semibold text-gray-900">1. Submit Request</h5>
                    <p className="leading-relaxed text-[11px] text-gray-500">Provide guest info, make payment, and upload your receipt proof.</p>
                  </div>
                  <div className="space-y-1 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4">
                    <h5 className="font-semibold text-gray-900">2. Quick Verification</h5>
                    <p className="leading-relaxed text-[11px] text-gray-500">Our concierge reviews and verifies receipt settlement in under 15 minutes.</p>
                  </div>
                  <div className="space-y-1 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4">
                    <h5 className="font-semibold text-gray-900">3. Check-In Seamless</h5>
                    <p className="leading-relaxed text-[11px] text-gray-500">Receive guaranteed instant check-in instructions via email & WhatsApp.</p>
                  </div>
                </div>
              </div>
            </div>

          </form>

          {/* Right Column: Sticky Invoice Summary Card */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 space-y-6 shadow-xl">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-serif text-lg font-semibold text-gray-900">Summary Details</h3>
                <span className="text-[10px] text-gray-400 tracking-wider">Review booking before finalizing</span>
              </div>

              {/* Suite Banner description */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded overflow-hidden shrink-0">
                  <img 
                    src={tempBooking.suiteId === 'jimbaran-suite' 
                      ? 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=300&q=80'
                      : tempBooking.suiteId === 'seminyak-suite'
                        ? 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=300&q=80'
                        : tempBooking.suiteId === 'canggu-suite'
                          ? 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=300&q=80'
                          : 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&q=80'
                    }
                    alt={tempBooking.suiteName} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-gray-900">{tempBooking.suiteName}</h4>
                  <div className="flex items-center space-x-1.5 text-xs text-amber-500 mt-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-500" />)}
                    <span className="text-[10px] text-gray-400 font-light"> (Luxury Sanctum)</span>
                  </div>
                </div>
              </div>

              {/* Dates grid list */}
              <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-4 text-xs font-light text-gray-600">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase text-gray-400 tracking-widest block font-medium">Check-In</span>
                  <strong className="text-gray-800 text-sm font-semibold">{tempBooking.checkIn}</strong>
                  <span className="text-[10px] text-gray-400 block">From 14:00 PM</span>
                </div>
                <div className="space-y-0.5 border-l border-gray-100 pl-4">
                  <span className="text-[9px] uppercase text-gray-400 tracking-widest block font-medium">Check-Out</span>
                  <strong className="text-gray-800 text-sm font-semibold">{tempBooking.checkOut}</strong>
                  <span className="text-[10px] text-gray-400 block">Before 12:00 PM</span>
                </div>
              </div>

              {/* Calculations breakdown list */}
              <div className="space-y-3 text-xs text-gray-600 font-light">
                {tempBooking.dayDetails && tempBooking.dayDetails.length > 0 && (
                  <div className="space-y-1.5 bg-gray-50/50 p-2.5 rounded border border-gray-100 text-[11px] text-gray-500">
                    <span className="font-semibold text-gray-700 block mb-1">Rincian per Malam:</span>
                    {tempBooking.dayDetails.map((detail: any, i: number) => (
                      <div key={i} className="flex justify-between">
                        <span>Malam {i + 1}: {detail.dayName} ({detail.label})</span>
                        <span>{formatRupiah(detail.rate)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Tarif Dasar (Weekdays)</span>
                  <span>{formatRupiah(tempBooking.suitePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Durasi Tinggal</span>
                  <span>{tempBooking.totalNights} malam</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Kebersihan & Layanan</span>
                  <span>{formatRupiah(tempBooking.serviceCleaningFee)}</span>
                </div>

                <div className="border-t border-gray-100 pt-3.5 flex justify-between font-serif text-lg font-bold text-gray-900">
                  <span>Total Pembayaran</span>
                  <span>{formatRupiah(tempBooking.totalAmount)}</span>
                </div>
              </div>

              {/* Master trigger button */}
              <button
                type="submit"
                onClick={handleConfirmReservation}
                disabled={submitting}
                className="w-full py-4 bg-[#62462b] hover:bg-[#7c5d41] disabled:bg-gray-400 text-white font-semibold text-xs tracking-[0.25em] uppercase transition-all duration-300 rounded-md shadow-lg flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>VERIFYING SETTLEMENT...</span>
                  </>
                ) : (
                  <span>CONFIRM & REGISTER STAY</span>
                )}
              </button>

              <div className="text-center">
                <span className="text-[9px] text-gray-400 uppercase tracking-widest flex items-center justify-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#62462b]" />
                  <span>Secure encrypted reservation</span>
                </span>
              </div>
            </div>

            {/* Visual Decorative Close-up Images at Bottom of Sticky (4 Arches) */}
            <div className="grid grid-cols-4 gap-2">
              <div className="h-16 rounded-t-full overflow-hidden shadow-sm">
                <img src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=200&q=80" alt="Resort bed" className="w-full h-full object-cover" />
              </div>
              <div className="h-16 rounded-t-full overflow-hidden shadow-sm">
                <img src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=200&q=80" alt="Bath" className="w-full h-full object-cover" />
              </div>
              <div className="h-16 rounded-t-full overflow-hidden shadow-sm">
                <img src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=200&q=80" alt="Pool" className="w-full h-full object-cover" />
              </div>
              <div className="h-16 rounded-t-full overflow-hidden shadow-sm">
                <img src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=200&q=80" alt="Dinner" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
