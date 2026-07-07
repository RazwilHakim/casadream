import React, { useState, useEffect } from 'react';
import { Calendar, Users, ChevronLeft, ShieldCheck, Heart, Coffee, Wifi, Tv, Wind, Check, Star, HelpCircle, MapPin, Sparkles, Minus, Plus, ChevronDown, Info } from 'lucide-react';
import { suitesData } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { formatRupiah, calculateBookingPrice, formatDisplayDate } from '../utils';
import CustomDatePicker from './CustomDatePicker';


interface SuiteDetailViewProps {
  suiteId: string;
  setView: (view: string, suiteId?: string) => void;
  bookingDates: { checkIn: string; checkOut: string; guests: number };
  setBookingDates: React.Dispatch<React.SetStateAction<{ checkIn: string; checkOut: string; guests: number }>>;
  setTempBooking: (booking: any) => void;
}

export default function SuiteDetailView({ 
  suiteId, 
  setView, 
  bookingDates, 
  setBookingDates,
  setTempBooking
}: SuiteDetailViewProps) {
  const suite = suitesData.find((s) => s.id === suiteId) || suitesData[0]; // default to Casa Dream Villa
  const [liked, setLiked] = useState(false);
  const [guestSelectorOpen, setGuestSelectorOpen] = useState(false);


  // Dynamic state calculations
  const [nights, setNights] = useState(3);
  const [basePrice, setBasePrice] = useState(10500000);
  const [serviceFee, setServiceFee] = useState(250000); // Fixed cleaning / luxury service fee
  const [totalPrice, setTotalPrice] = useState(10750000);
  const [dayDetails, setDayDetails] = useState<any[]>([]);

  // Recalculate nights and prices when dates change
  useEffect(() => {
    if (bookingDates.checkIn && bookingDates.checkOut) {
      const summary = calculateBookingPrice(bookingDates.checkIn, bookingDates.checkOut);
      setNights(summary.nights);
      setBasePrice(summary.baseRateTotal);
      setServiceFee(summary.serviceCleaningFee);
      setTotalPrice(summary.totalAmount);
      setDayDetails(summary.details);
    }
  }, [bookingDates.checkIn, bookingDates.checkOut]);

  const handleBookNow = () => {
    // Generate simulated booking object to persist in app state
    const simulatedBooking = {
      suiteId: suite.id,
      suiteName: suite.name,
      suitePrice: suite.price,
      checkIn: bookingDates.checkIn,
      checkOut: bookingDates.checkOut,
      guests: bookingDates.guests,
      totalNights: nights,
      baseRateTotal: basePrice,
      serviceCleaningFee: serviceFee,
      totalAmount: totalPrice,
      dayDetails: dayDetails
    };

    setTempBooking(simulatedBooking);
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="suite-detail-view" className="bg-[#FFF8F5] text-[#1E1B18] py-12 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* Back Button */}
      <div className="mb-8">
        <button
          onClick={() => {
            setView('home');
            setTimeout(() => {
              const el = document.getElementById('suites-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Collections</span>
        </button>
      </div>

      {/* Header and Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] text-[#62462b] font-semibold">
            <span>The Collections Sanctuary</span>
            <span>•</span>
            <span className="flex items-center"><Star className="w-3 h-3 fill-[#62462b] text-[#62462b] mr-1" /> 5.0 Star Rating</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl tracking-tight text-gray-900">
            {suite.name}
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-light flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-[#62462b]" /> Puncak Hills Sanctuary, Indonesia
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setLiked(!liked)}
            className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Mulai dari</span>
            <span className="font-serif text-3xl font-semibold text-[#1A1A1A]">{formatRupiah(suite.price)}</span>
            <span className="text-xs text-gray-500"> / malam</span>
          </div>
        </div>
      </div>

      {/* BENTO IMAGE GALLERY */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-16">
        {/* Main large room sanctuary image */}
        <div className="md:col-span-8 h-[350px] md:h-[500px] rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-[#1C1C1C] to-[#2D2D2D] flex flex-col items-center justify-center p-12 text-center text-white border border-[#E5D5C5]/20">
          {suite.images[0] ? (
            <img 
              src={suite.images[0]} 
              alt={`${suite.name} Bed`} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
            />
          ) : (
            <>
              <Sparkles className="w-10 h-10 text-[#E5D5C5]/40 mb-3 animate-pulse" />
              <h3 className="font-serif text-2xl tracking-[0.25em] text-[#E5D5C5] uppercase font-light">Casa Dream Sanctuary</h3>
              <p className="text-xs text-gray-400 font-light tracking-wide max-w-sm mt-2">Exclusive High-Elevation Premium Villa in Puncak (Photo Pending Upload)</p>
            </>
          )}
        </div>
        
        {/* Sidebar double vertical bento images */}
        <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-4">
          <div className="h-[165px] md:h-[242px] rounded-lg overflow-hidden shadow-md bg-[#1C1C1C] flex flex-col items-center justify-center p-6 text-center text-white border border-[#E5D5C5]/20">
            {suite.images[1] ? (
              <img 
                src={suite.images[1]} 
                alt={`${suite.name} Living`} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
            ) : (
              <>
                <Coffee className="w-6 h-6 text-[#E5D5C5]/40 mb-2" />
                <span className="font-serif text-sm tracking-widest text-[#E5D5C5] uppercase font-light">Premium Comfort</span>
                <span className="text-[9px] text-gray-500 uppercase mt-1">Interior View</span>
              </>
            )}
          </div>
          <div className="h-[165px] md:h-[242px] rounded-lg overflow-hidden shadow-md bg-[#1C1C1C] flex flex-col items-center justify-center p-6 text-center text-white border border-[#E5D5C5]/20">
            {suite.images[2] ? (
              <img 
                src={suite.images[2]} 
                alt={`${suite.name} Bathroom`} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
            ) : (
              <>
                <Wifi className="w-6 h-6 text-[#E5D5C5]/40 mb-2" />
                <span className="font-serif text-sm tracking-widest text-[#E5D5C5] uppercase font-light">Fully Serviced</span>
                <span className="text-[9px] text-gray-500 uppercase mt-1">Amenity View</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* TWO COLUMNS DESCRIPTION & BOOKING BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column (Amenities, highlights, description) */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Description */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-2">
              The Retreat Experience
            </h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              {suite.longDescription}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 p-5 bg-white border border-gray-100 rounded-lg text-center shadow-sm">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Room Dimensions</span>
              <span className="font-serif text-sm md:text-base font-semibold text-gray-900">{suite.size}</span>
            </div>
            <div className="border-x border-gray-100">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Max Guests</span>
              <span className="font-serif text-sm md:text-base font-semibold text-gray-900">{suite.capacity}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Bedding Configuration</span>
              <span className="font-serif text-sm md:text-base font-semibold text-gray-900">{suite.bedType}</span>
            </div>
          </div>

          {/* Suite Amenities Grid */}
          <div className="space-y-6">
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Premium Suite Inclusions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suite.amenities.map((item) => (
                <div key={item} className="flex items-center space-x-3 text-xs md:text-sm text-gray-600">
                  <div className="p-1.5 bg-[#FAF8F5] border border-gray-100 text-[#B89F88] rounded-sm">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-light">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suite Highlights Row (3 column arched images) */}
          <div className="space-y-8 pt-4">
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Villa Highlights
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {suite.highlights.map((item, index) => (
                <div key={index} className="flex flex-col space-y-3 text-center">
                  <div className="h-44 rounded-t-full overflow-hidden shadow-md bg-gradient-to-b from-[#1C1C1C] to-[#222222] flex flex-col items-center justify-center p-4 border border-[#E5D5C5]/20">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-[#E5D5C5]/40 mb-2" />
                        <span className="font-serif text-xs text-[#E5D5C5] uppercase tracking-wider">{item.title}</span>
                      </>
                    )}
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-gray-900 mt-1">{item.title}</h4>
                  <p className="text-[11px] text-gray-500 font-light leading-relaxed px-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (Live booking calculator sidebar) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-6 md:p-8 sticky top-28 space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-serif text-lg md:text-xl font-semibold text-gray-900">Your Private Stay</h3>
              <p className="text-[11px] text-gray-400">Configure dates for real-time rates</p>
            </div>

            {/* Inputs Form */}
            <div className="space-y-4">
              {/* Custom Date Range Picker */}
              <CustomDatePicker
                checkIn={bookingDates.checkIn}
                checkOut={bookingDates.checkOut}
                onChange={(dates) => setBookingDates({ ...bookingDates, ...dates })}
              />

              {/* Guests Count */}
              <div className="space-y-1.5 relative">
                <label className="text-[10px] uppercase tracking-wider text-[#B89F88] font-semibold flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Guests Count</span>
                </label>

                {/* Polished custom interactive trigger button */}
                <button
                  type="button"
                  onClick={() => setGuestSelectorOpen(!guestSelectorOpen)}
                  className="flex items-center justify-between w-full bg-[#FAF8F5] hover:bg-[#F5F1EB] border border-[#E5D5C5]/50 hover:border-[#B89F88] rounded-lg py-2.5 px-3.5 transition-all duration-300 min-h-[46px] text-left shadow-sm focus:outline-none"
                >
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-900 leading-tight">
                      {bookingDates.guests} {bookingDates.guests > 1 ? 'Orang' : 'Orang'}
                    </span>
                    <span className="text-[8px] text-gray-400 font-light mt-0.5">Kapasitas Maks. 20</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#B89F88] transition-transform duration-300 ${guestSelectorOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Premium Guest Counter Popover Dropdown */}
                <AnimatePresence>
                  {guestSelectorOpen && (
                    <>
                      {/* Click outside backdrop overlay */}
                      <div 
                        className="fixed inset-0 z-40 cursor-default" 
                        onClick={() => setGuestSelectorOpen(false)} 
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 left-0 mt-2 bg-white rounded-xl shadow-2xl border border-[#E5D5C5]/30 p-5 z-50 space-y-4 w-full"
                      >
                        <div className="flex items-start justify-between border-b border-gray-50 pb-2.5">
                          <div>
                            <h4 className="font-serif text-xs font-semibold text-gray-900">Jumlah Tamu</h4>
                            <p className="text-[9px] text-gray-400">Total anak-anak & dewasa</p>
                          </div>
                          <div className="px-2 py-0.5 bg-[#FAF8F5] rounded border border-gray-100 text-[8px] uppercase tracking-wider text-[#B89F88] font-semibold">
                            Max 20
                          </div>
                        </div>

                        {/* Stepper controls */}
                        <div className="flex items-center justify-between py-1">
                          <button
                            type="button"
                            disabled={bookingDates.guests <= 1}
                            onClick={() => setBookingDates({ ...bookingDates, guests: bookingDates.guests - 1 })}
                            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                              bookingDates.guests <= 1 
                                ? 'border-gray-100 text-gray-300 cursor-not-allowed' 
                                : 'border-[#E5D5C5] text-[#1A1A1A] hover:bg-[#FAF8F5] hover:border-[#B89F88]'
                            }`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex flex-col items-center">
                            <span className="font-serif text-2xl font-bold text-gray-900 leading-none">
                              {bookingDates.guests}
                            </span>
                            <span className="text-[9px] text-gray-400 font-light mt-0.5">Orang</span>
                          </div>

                          <button
                            type="button"
                            disabled={bookingDates.guests >= 20}
                            onClick={() => setBookingDates({ ...bookingDates, guests: bookingDates.guests + 1 })}
                            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                              bookingDates.guests >= 20 
                                ? 'border-gray-100 text-gray-300 cursor-not-allowed' 
                                : 'border-[#E5D5C5] text-[#1A1A1A] hover:bg-[#FAF8F5] hover:border-[#B89F88]'
                            }`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Capacities notice banner */}
                        {bookingDates.guests >= 20 ? (
                          <div className="p-2 bg-amber-50 rounded-lg text-[9px] text-amber-800 flex items-start space-x-1.5 border border-amber-100">
                            <Info className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                            <span>Kapasitas maksimal (20 tamu) telah tercapai.</span>
                          </div>
                        ) : (
                          <div className="p-2 bg-[#FAF8F5] rounded-lg text-[9px] text-gray-500 flex items-start space-x-1.5 border border-gray-100">
                            <Info className="w-3 h-3 text-[#B89F88] shrink-0 mt-0.5" />
                            <span>Maksimal 20 orang tamu di area villa pribadi.</span>
                          </div>
                        )}

                        {/* Jump Presets Quick Select */}
                        <div className="space-y-1 border-t border-gray-50 pt-2.5">
                          <span className="text-[8px] uppercase tracking-wider text-gray-400 block font-medium">Pilih Cepat:</span>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[2, 5, 10, 20].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setBookingDates({ ...bookingDates, guests: num })}
                                className={`py-1 text-xs font-semibold rounded transition-all ${
                                  bookingDates.guests === num
                                    ? 'bg-[#1A1A1A] text-white'
                                    : 'bg-[#FAF8F5] hover:bg-[#F5F1EB] text-gray-700 border border-gray-100'
                                }`}
                              >
                                {num}p
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Close Selesai Button */}
                        <button
                          type="button"
                          onClick={() => setGuestSelectorOpen(false)}
                          className="w-full py-1.5 bg-[#B89F88] hover:bg-[#1A1A1A] text-white font-medium text-[10px] rounded transition-colors"
                        >
                          Selesai
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs text-gray-600 font-light">
              <div className="space-y-1.5 border-b border-gray-50 pb-2">
                <span className="text-[10px] uppercase text-gray-400 font-medium block">Rincian Tarif per Malam:</span>
                {dayDetails.length > 0 ? (
                  dayDetails.map((detail, index) => (
                    <div key={index} className="flex justify-between text-gray-500 font-light text-[11px]">
                      <span>Malam {index + 1}: {detail.dayName} ({detail.label})</span>
                      <span>{formatRupiah(detail.rate)}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between text-gray-500 font-light text-[11px]">
                    <span>Tarif Dasar (Weekdays)</span>
                    <span>{formatRupiah(suite.price)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <span>Total Sewa ({nights} malam)</span>
                <span>{formatRupiah(basePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Kebersihan & Layanan</span>
                <span>{formatRupiah(serviceFee)}</span>
              </div>
              
              <div className="border-t border-gray-100 pt-3 flex justify-between font-serif text-base font-semibold text-gray-900">
                <span>Total Estimasi</span>
                <span>{formatRupiah(totalPrice)}</span>
              </div>
            </div>

            {/* Book Button */}
            <button
              onClick={handleBookNow}
              className="w-full py-4 bg-[#1A1A1A] hover:bg-[#B89F88] text-white hover:text-[#1A1A1A] font-semibold text-xs tracking-[0.25em] uppercase transition-all duration-300 rounded-md shadow-lg"
            >
              PROCEED TO PAYMENT
            </button>

            {/* Trust badge */}
            <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-400 bg-gray-50 p-2.5 rounded border border-gray-100">
              <ShieldCheck className="w-4 h-4 text-[#B89F88] shrink-0" />
              <span>Full cancellation & refund terms apply. See footer.</span>
            </div>

            {/* Assistance Card */}
            <div className="bg-[#1C1C1C] text-white p-5 rounded-md space-y-3">
              <h5 className="font-serif text-sm font-semibold tracking-wide flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-[#E5D5C5]" />
                <span>Need help booking?</span>
              </h5>
              <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                Our private concierge is on-call to tailor your itinerary or manage special group setups.
              </p>
              <button
                onClick={() => {
                  const chatBtn = document.getElementById('floating-concierge-chat-button');
                  if (chatBtn) chatBtn.click();
                }}
                className="w-full py-2 bg-transparent border border-white/20 hover:border-white text-xs tracking-wider uppercase rounded text-center transition-colors font-semibold"
              >
                MESSAGE CONCIERGE
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
