import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Download, MessageSquare, Send, Calendar, Users, FileText, ArrowRight, ShieldCheck, User, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { ChatMessage } from '../types';
import { formatRupiah } from '../utils';
import { jsPDF } from 'jspdf';

interface ConfirmationViewProps {
  finalBooking: any;
  setView: (view: string) => void;
}

export default function ConfirmationView({ finalBooking, setView }: ConfirmationViewProps) {
  // Redirect back if no booking has been completed
  if (!finalBooking) {
    return (
      <div className="text-center py-24 px-6 max-w-xl mx-auto space-y-4">
        <AlertCircle className="w-12 h-12 text-[#B89F88] mx-auto animate-pulse" />
        <h2 className="font-serif text-2xl font-semibold">No Booking Found</h2>
        <p className="text-sm text-gray-500 font-light">It looks like you haven't completed a checkout reservation. Please choose a suite and proceed to payment first.</p>
        <button
          onClick={() => setView('home')}
          className="px-6 py-2.5 bg-[#1A1A1A] text-white uppercase text-xs tracking-widest rounded-sm hover:bg-[#B89F88]"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Interactive Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'admin',
      text: finalBooking.status === 'pending'
        ? `Selamat Datang, Bapak/Ibu ${finalBooking.guestName}! Thank you for reserving your luxury stay at Casa Dream Villa. We have received your payment proof, and our administrative team is currently reviewing it. Once approved, your status will instantly update to CONFIRMED.`
        : `Selamat Datang, Bapak/Ibu ${finalBooking.guestName}! Thank you for reserving your luxury stay at Casa Dream Villa. Your payment receipt has been successfully verified, and your booking is fully CONFIRMED.`,
      timestamp: 'Just now'
    },
    {
      id: '2',
      sender: 'admin',
      text: 'I am your dedicated private concierge. Please let me know if you require airport pick-up (from Soekarno-Hatta or Halim), have specific dietary requests, or need help planning your Puncak tours.',
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate luxury concierge reply
    setTimeout(() => {
      setIsTyping(false);
      let replyText = 'Certainly! I have noted down your request. Our staff is preparing the suite according to our highest luxury standards. We look forward to welcoming you soon!';
      
      const lowerText = userMsg.text.toLowerCase();
      if (lowerText.includes('makan') || lowerText.includes('food') || lowerText.includes('breakfast')) {
        replyText = 'Of course. Breakfast is fully included and cooked fresh by our private villa chef. Do you have any specific allergies or preferences (Indonesian/Western)?';
      } else if (lowerText.includes('pool') || lowerText.includes('jacuzzi') || lowerText.includes('hangat')) {
        replyText = 'The pool and jacuzzi are heated to a perfect 38°C (100°F) to ensure you remain perfectly warm in Puncak’s crisp mountain breeze.';
      } else if (lowerText.includes('jemput') || lowerText.includes('pick') || lowerText.includes('airport') || lowerText.includes('mobil')) {
        replyText = 'We can arrange a private Alphard or Fortuner shuttle directly from Jakarta to Puncak. The driver details and cost estimate will be sent to your WhatsApp shortly.';
      } else if (lowerText.includes('billiard') || lowerText.includes('biliar') || lowerText.includes('karaoke')) {
        replyText = 'Both the Billiard Lounge and Karaoke setup are free to use anytime for our suite guests. We will stock the lounge mini-bar with your favorite beverages!';
      }

      const adminMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'admin',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, adminMsg]);
    }, 2000);
  };

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    
    // Set Document Properties
    doc.setProperties({
      title: `Invoice-${finalBooking.invoiceNumber}`,
      subject: 'Casa Dream Villa Booking Invoice',
      author: 'Casa Dream Villa Sanctuary',
    });

    // 1. Header & Brand Color Palette (Deep Charcoal and Warm Gold/Taupe styling)
    doc.setFillColor(26, 26, 26); // Deep Charcoal header
    doc.rect(0, 0, 210, 45, 'F');
    
    // Brand Typography
    doc.setTextColor(184, 159, 136); // #B89F88 Gold Accent
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('CASA DREAM VILLA', 20, 24);
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('SANCTUARY & LUXURY RESORT', 20, 32);
    doc.text('Puncak, Bogor, Indonesia', 20, 37);

    // Invoice Title on the Header Right
    doc.setTextColor(184, 159, 136);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('OFFICIAL INVOICE', 140, 24);
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`No: ${finalBooking.invoiceNumber}`, 140, 32);
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`, 140, 37);

    // 2. Invoice Meta Info Blocks (Guest & Stay Details side-by-side)
    doc.setTextColor(26, 26, 26);
    
    // Box 1: Guest Details (Left side)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('RINCIAN TAMU:', 20, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Nama: ${finalBooking.guestName}`, 20, 67);
    doc.text(`Email: ${finalBooking.guestEmail}`, 20, 73);
    doc.text(`Telp: ${finalBooking.guestPhone}`, 20, 79);

    // Box 2: Stay Details (Right side)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('RINCIAN VILLA & MASA TINGGAL:', 110, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Villa: Casa Dream Villa`, 110, 67);
    doc.text(`Check-In: ${finalBooking.checkIn}`, 110, 73);
    doc.text(`Check-Out: ${finalBooking.checkOut}`, 110, 79);
    doc.text(`Durasi: ${finalBooking.totalNights} Malam`, 110, 85);
    doc.text(`Jumlah Tamu: ${finalBooking.guests} Orang`, 110, 91);

    // Thin elegant separator line
    doc.setDrawColor(229, 213, 197); // #E5D5C5 light gold tint
    doc.setLineWidth(0.5);
    doc.line(20, 100, 190, 100);

    // 3. Itemized Rincian Biaya (Table Header)
    doc.setFillColor(245, 242, 237); // Light gold-tint background for table header
    doc.rect(20, 108, 170, 8, 'F');
    doc.setTextColor(26, 26, 26);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('DESKRIPSI SEWA & LAYANAN', 24, 113.5);
    doc.text('RINCIAN HARGA', 150, 113.5);

    // Table Content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    let currentY = 124;

    // Check if day details exist
    if (finalBooking.dayDetails && finalBooking.dayDetails.length > 0) {
      finalBooking.dayDetails.forEach((detail: any, index: number) => {
        doc.text(`Malam ${index + 1}: ${detail.dayName} (${detail.label})`, 24, currentY);
        doc.text(formatRupiah(detail.rate), 150, currentY);
        currentY += 8;
      });
    } else {
      doc.text(`Sewa Dasar Casa Dream Villa (Per Malam)`, 24, currentY);
      doc.text(formatRupiah(finalBooking.baseRateTotal / finalBooking.totalNights), 150, currentY);
      currentY += 8;
    }

    // Divider before secondary fees
    doc.setDrawColor(240, 240, 240);
    doc.line(20, currentY, 190, currentY);
    currentY += 6;

    // Service & Cleaning Fee
    doc.text('Biaya Kebersihan & Layanan Resort Premium (Flat)', 24, currentY);
    doc.text(formatRupiah(finalBooking.serviceCleaningFee), 150, currentY);
    currentY += 12;

    // Elegant separator line
    doc.setDrawColor(184, 159, 136); // Gold Accent line
    doc.setLineWidth(0.8);
    doc.line(20, currentY, 190, currentY);
    currentY += 8;

    // 4. Grand Total Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TOTAL PEMBAYARAN:', 90, currentY);
    doc.setFontSize(13);
    doc.setTextColor(184, 159, 136); // Gold color for total
    doc.text(formatRupiah(finalBooking.totalAmount), 150, currentY);

    currentY += 15;

    // 5. Verification Barcode / Footer Area
    doc.setFillColor(250, 248, 245); // Soft off-white background box for verification notice
    doc.rect(20, currentY, 170, 32, 'F');

    // Security Badge Icon Text representation
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(40, 167, 69); // Green
    doc.text('STATUS: PEMBAYARAN DISETUJUI & VERIFIKASI INSTAN', 26, currentY + 10);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Pembayaran telah diproses secara aman menggunakan sistem QRIS / Transfer Bank otomatis.', 26, currentY + 16);
    doc.text('Tunjukkan file digital / cetak invoice ini saat melakukan proses check-in di resort.', 26, currentY + 22);

    currentY += 44;

    // 6. Signature / Footer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Terima kasih telah memilih untuk menghabiskan waktu berharga Anda bersama Casa Dream Villa Sanctuary.', 105, currentY, { align: 'center' });
    doc.text('Kenyamanan, keheningan, dan pelayanan bintang lima menanti kehadiran Anda di Puncak.', 105, currentY + 4, { align: 'center' });

    // Save PDF file
    doc.save(`Invoice-${finalBooking.invoiceNumber}.pdf`);
  };

  return (
    <div id="confirmation-view" className="bg-[#F3EAE0] text-[#2B1B15] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Banner Status Success */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.3em] text-[#B89F88] font-bold">Pesan Sekarang! Success</span>
            <h1 className="font-serif text-3xl md:text-5xl text-gray-900 tracking-tight font-light">Stay Reserved</h1>
          </div>
          <p className="text-xs md:text-sm text-gray-500 font-light leading-relaxed">
            Your payment receipt has been successfully verified. A digital copy of your receipt, check-in barcodes, and map coordinates has been sent to your WhatsApp and email.
          </p>
        </div>

        {/* Grid: Details and Invoice */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Image Collage & Verified Badges */}
          <div className="lg:col-span-6 space-y-8">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8 h-80 rounded-l-3xl rounded-r rounded-b overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80" 
                  alt="Villa main exterior pool" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="col-span-4 h-80 rounded-r-3xl rounded-l rounded-b overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=400&q=80" 
                  alt="Luxury bath closeup" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

            {/* Verified Sanctuary Card details */}
            <div className="bg-white p-6 border border-gray-100 rounded-lg shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-[#B89F88]/10 text-[#B89F88] rounded-full shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 text-xs text-gray-600 font-light leading-relaxed">
                <h4 className="font-serif text-sm font-semibold text-gray-900 flex items-center space-x-2">
                  <span>Verified Sanctuary</span>
                  {finalBooking.status === 'pending' ? (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] uppercase font-bold tracking-wider rounded-sm">PENDING REVIEW</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[9px] uppercase font-bold tracking-wider rounded-sm">CONFIRMED</span>
                  )}
                </h4>
                <p>
                  {finalBooking.status === 'pending'
                    ? `Your payment receipt for Casa Dream Villa is being verified by our staff. Your suite is temporarily locked and held for you.`
                    : `Your suite at Casa Dream Villa is guaranteed and fully prepared for your arrival. No secondary confirmation is required.`
                  }
                </p>
                <div className="flex space-x-4 pt-1 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  <span>🗺️ TUGU UTARA, PUNCAK</span>
                  <span>🔒 ESCROW SECURED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: PDF Invoice Layout Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden">
              
              {/* Card Header styling */}
              <div className="bg-[#1A1A1A] text-white p-6 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase text-[#E5D5C5] tracking-widest block font-medium">Boutique Resort Stay</span>
                  <h3 className="font-serif text-lg font-semibold tracking-wide">CASA INVOICE</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block">No. Invoice</span>
                  <span className="text-xs font-mono font-bold text-gray-200">{finalBooking.invoiceNumber}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 md:p-8 space-y-6 text-xs text-gray-600 font-light">
                
                {/* Guest & Payment Status banner */}
                <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase text-gray-400 tracking-wider font-semibold block">Registered Guest</span>
                    <strong className="text-gray-800 text-sm font-semibold flex items-center">
                      <User className="w-3.5 h-3.5 mr-1 text-gray-400" /> {finalBooking.guestName}
                    </strong>
                    <span className="text-[10px] text-gray-400 block">{finalBooking.guestEmail} • {finalBooking.guestPhone}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[9px] uppercase text-gray-400 tracking-wider font-semibold block">Settlement Status</span>
                    {finalBooking.status === 'pending' ? (
                      <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 font-bold uppercase text-[9px] tracking-wider rounded-sm">
                        PENDING REVIEW
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-green-50 border border-green-200 text-green-700 font-bold uppercase text-[9px] tracking-wider rounded-sm">
                        PAYMENT CONFIRMED
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400 block uppercase">via {finalBooking.paymentMethod === 'qris' ? 'QRIS RAPID' : 'BANK TRANSFER'}</span>
                  </div>
                </div>

                {/* Stay Breakdown Grid */}
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <span className="text-[9px] uppercase text-gray-400 tracking-widest block font-medium">Sanctuary Suite</span>
                    <strong className="text-gray-800 text-sm font-semibold">{finalBooking.suiteName}</strong>
                    <span className="text-[10px] text-gray-400 block">{finalBooking.totalNights} Nights • {finalBooking.guests} Guests</span>
                  </div>
                  <div className="border-l border-gray-100 pl-4 space-y-1">
                    <span className="text-[9px] uppercase text-gray-400 tracking-widest block font-medium">Stay Window</span>
                    <div className="flex items-center space-x-1.5 text-gray-800 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#B89F88] shrink-0" />
                      <span>{finalBooking.checkIn} to {finalBooking.checkOut}</span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown list */}
                <div className="space-y-2.5">
                  {finalBooking.dayDetails && finalBooking.dayDetails.length > 0 && (
                    <div className="space-y-1 bg-gray-50 p-2.5 rounded border border-gray-100 text-[11px] text-gray-500 mb-2">
                      <span className="font-semibold text-gray-700 block mb-1">Rincian per Malam:</span>
                      {finalBooking.dayDetails.map((detail: any, i: number) => (
                        <div key={i} className="flex justify-between">
                          <span>Malam {i + 1}: {detail.dayName} ({detail.label})</span>
                          <span>{formatRupiah(detail.rate)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Subtotal sewa dasar</span>
                    <span>{formatRupiah(finalBooking.baseRateTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Kebersihan & Layanan</span>
                    <span>{formatRupiah(finalBooking.serviceCleaningFee)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-[10px] italic">
                    <span>Pajak pemerintah daerah & asuransi resort</span>
                    <span>Sudah termasuk</span>
                  </div>

                  {/* Grand total */}
                  <div className="border-t border-gray-100 pt-4 flex justify-between font-serif text-lg font-bold text-gray-900">
                    <span>Total Pembayaran</span>
                    <span>{formatRupiah(finalBooking.totalAmount)}</span>
                  </div>
                </div>

              </div>

              {/* Card Footer Actions */}
              <div className="bg-gray-50 border-t border-gray-100 p-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownloadInvoice}
                  className="flex-1 py-3 bg-white hover:bg-gray-100 text-[#1A1A1A] font-semibold text-xs tracking-wider uppercase border border-gray-200 transition-colors rounded-sm flex items-center justify-center space-x-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Invoice</span>
                </button>
                <button
                  onClick={() => setChatOpen(true)}
                  className="flex-1 py-3 bg-[#1A1A1A] hover:bg-[#B89F88] text-white hover:text-[#1A1A1A] font-semibold text-xs tracking-wider uppercase transition-all rounded-sm flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat with Concierge</span>
                </button>
              </div>

            </div>

            {/* Quick Contact Help chips */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-light px-2">
              <span>Concierge WA: <strong>+62 811-9004-8812</strong></span>
              <span>Email: <strong>stay@casadreampuncak.com</strong></span>
            </div>
          </div>

        </div>

      </div>

      {/* DYNAMIC EXPANDABLE CHAT DIALOG */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/60 z-100 flex items-center justify-center p-6 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg border border-gray-200 w-full max-w-lg h-[550px] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#1A1A1A] text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#B89F88] flex items-center justify-center text-[#1A1A1A] font-bold text-sm">
                  C
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold tracking-wide">Concierge Club</h4>
                  <div className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] text-gray-400 font-light">Online • Private Coordinator</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="text-gray-400 hover:text-white text-xs uppercase tracking-widest font-semibold p-1"
              >
                Close
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF8F5]">
              {messages.map((msg) => {
                const isAdmin = msg.sender === 'admin';
                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[80%] ${isAdmin ? 'mr-auto items-start' : 'ml-auto items-end'}`}
                  >
                    <span className="text-[9px] text-gray-400 mb-0.5 px-1 font-light">{msg.timestamp}</span>
                    <div 
                      className={`p-3.5 rounded-lg text-xs leading-relaxed ${
                        isAdmin 
                          ? 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm' 
                          : 'bg-[#B89F88] text-[#1A1A1A] rounded-tr-none font-medium'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex flex-col items-start max-w-[80%] mr-auto">
                  <span className="text-[9px] text-gray-400 mb-0.5 px-1 font-light">Concierge is writing</span>
                  <div className="p-3 bg-white border border-gray-100 rounded-lg text-gray-400 text-xs flex space-x-1 items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
              <input
                type="text"
                required
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask concierge about meals, jacuzzi, airport pick-up..."
                className="flex-1 bg-[#FAF8F5] border border-gray-200 text-xs py-3 px-4 rounded-md focus:outline-none focus:border-[#B89F88]"
              />
              <button
                type="submit"
                className="p-3 bg-[#1A1A1A] hover:bg-[#B89F88] text-white hover:text-[#1A1A1A] transition-colors rounded-md"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Helper Suggestions */}
            <div className="px-4 pb-4 bg-white flex flex-wrap gap-1.5 shrink-0">
              {[
                'Airport Pickup',
                'Heated Jacuzzi Temp',
                'Breakfast Inclusions',
                'Billiard & Karaoke Rules'
              ].map((suggest) => (
                <button
                  key={suggest}
                  type="button"
                  onClick={() => setInputText(`Tell me about the ${suggest.toLowerCase()}`)}
                  className="text-[10px] text-gray-500 bg-gray-100 border border-gray-200 hover:border-gray-300 py-1 px-2.5 rounded-full transition-colors"
                >
                  {suggest}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
