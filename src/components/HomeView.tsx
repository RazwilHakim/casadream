import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  MapPin, 
  Check,
  Maximize2,
  Bed,
  Bath,
  Car,
  Wifi,
  Sofa,
  Tv,
  Music,
  Trees,
  Thermometer,
  Wind,
  Waves,
  Utensils,
  Flame,
  Droplet,
  Minus,
  Plus,
  ChevronDown,
  Info,
  MessageSquare,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { suitesData } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { formatRupiah, formatDisplayDate } from '../utils';
import CustomDatePicker from './CustomDatePicker';


interface HomeViewProps {
  setView: (view: string, suiteId?: string) => void;
  bookingDates: { checkIn: string; checkOut: string; guests: number };
  setBookingDates: React.Dispatch<React.SetStateAction<{ checkIn: string; checkOut: string; guests: number }>>;
}

export default function HomeView({ setView, bookingDates, setBookingDates }: HomeViewProps) {
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [guestSelectorOpen, setGuestSelectorOpen] = useState(false);

  // States for Verified Reviews feature
  const [reviews, setReviews] = useState<any[]>(() => {
    const stored = localStorage.getItem('casa_dream_reviews');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'rev-1',
        name: 'Bambang Wijaya',
        origin: 'Jakarta, Indonesia',
        suiteName: 'Jimbaran Suite',
        rating: 5,
        text: '"We stayed at the Jimbaran Suite for our anniversary and it exceeded every dream. The hot outdoor jacuzzi in the chilly Puncak weather is magical. Absolute silence, pure luxury, and the concierge took care of every single meal for us."',
        date: 'Juli 2026'
      },
      {
        id: 'rev-2',
        name: 'Clara Anastasya',
        origin: 'Singapore',
        suiteName: 'Ubud Suite',
        rating: 5,
        text: '"Casa Dream is simply a masterpiece of peaceful sanctuary living. The Ubud Suite design feels totally integrated into the greenery, and waking up with mountain mist drifting through the valley is something I will never forget."',
        date: 'Juni 2026'
      }
    ];
  });

  // Sync reviews with localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('casa_dream_reviews');
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Review Form Fields
  const [reviewGuestName, setReviewGuestName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newOrigin, setNewOrigin] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');

    if (!reviewGuestName.trim()) {
      setReviewError('Nama lengkap Anda wajib diisi.');
      return;
    }
    if (!newComment.trim()) {
      setReviewError('Silakan masukkan ulasan / komentar Anda.');
      return;
    }

    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const currentDate = new Date();
    const dateString = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const newReview = {
      id: `rev-${Date.now()}`,
      name: reviewGuestName.trim(),
      origin: newOrigin.trim() || 'Tamu Terverifikasi',
      suiteName: 'Casa Dream Villa',
      rating: newRating,
      text: `"${newComment.trim()}"`,
      date: dateString
    };

    let currentReviews = [];
    try {
      const stored = localStorage.getItem('casa_dream_reviews');
      currentReviews = stored ? JSON.parse(stored) : reviews;
    } catch (err) {
      currentReviews = reviews;
    }

    const updatedReviews = [newReview, ...currentReviews];
    setReviews(updatedReviews);
    localStorage.setItem('casa_dream_reviews', JSON.stringify(updatedReviews));

    setReviewSuccess(true);
    setReviewGuestName('');
    setNewComment('');
    setNewRating(5);
    setNewOrigin('');
    setReviewError('');

    setTimeout(() => {
      setReviewSuccess(false);
    }, 4000);
  };


  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    setAvailabilityMessage('Suites are available for these dates! Scroll down to select your perfect sanctuary.');
    setTimeout(() => {
      setAvailabilityMessage('');
      const el = document.getElementById('suites-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 3000);
  };

  const handleSuiteExplore = (suiteId: string) => {
    setView('suite-detail', suiteId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="home-view" className="bg-[#FFF8F5] text-[#1E1B18] font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-[#62462b] text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80" 
            alt="Casa Dream Villa Exterior" 
            className="w-full h-full object-cover opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#62462b] via-transparent to-[#62462b]/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl px-6 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ffdcc0]" />
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#ffdcc0] font-light">A Quiet Luxury Retreat in Puncak</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-serif text-4xl md:text-7xl lg:text-8xl tracking-tight leading-none"
          >
            Your Private <br />
            <span className="font-light italic text-[#ffdcc0]">Sanctuary</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xs md:text-sm tracking-[0.2em] uppercase text-gray-200 font-light max-w-2xl mx-auto"
          >
            Immerse yourself in Indonesian-inspired architectural brilliance, pristine nature, and warm personalized hospitality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="pt-6"
          >
            <button
              onClick={() => {
                const el = document.getElementById('booking-bar');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="animate-bounce inline-flex flex-col items-center justify-center cursor-pointer text-gray-300 hover:text-[#ffdcc0] transition-colors"
            >
              <span className="text-[9px] uppercase tracking-[0.4em] mb-2 font-light">Scroll Down</span>
              <div className="w-7 h-11 border border-white/30 rounded-full flex items-start justify-center p-1.5">
                <div className="w-1.5 h-1.5 bg-[#ffdcc0] rounded-full animate-ping" />
              </div>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. BOOKING BAR WIDGET */}
      <section id="booking-bar" className="relative -mt-16 z-30 max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 border border-[#E5D5C5]/30">
          <form onSubmit={handleCheckAvailability} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            
            {/* Custom Date Range Picker */}
            <CustomDatePicker
              checkIn={bookingDates.checkIn}
              checkOut={bookingDates.checkOut}
              onChange={(dates) => setBookingDates({ ...bookingDates, ...dates })}
            />

            {/* Guests Count */}
            <div className="space-y-2 relative">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#B89F88] font-semibold flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Guests Count</span>
              </label>

              {/* Polished custom interactive trigger button */}
              <button
                type="button"
                onClick={() => setGuestSelectorOpen(!guestSelectorOpen)}
                className="flex items-center justify-between w-full bg-[#FAF8F5] hover:bg-[#F5F1EB] border border-[#E5D5C5]/50 hover:border-[#B89F88] rounded-lg py-3 px-4 transition-all duration-300 min-h-[50px] text-left shadow-sm focus:outline-none"
              >
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-gray-900 leading-tight">
                    {bookingDates.guests} {bookingDates.guests > 1 ? 'Orang' : 'Orang'}
                  </span>
                  <span className="text-[9px] text-gray-400 font-light mt-0.5">Kapasitas Maks. 20</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#B89F88] transition-transform duration-300 ${guestSelectorOpen ? 'rotate-180' : ''}`} />
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
                      className="absolute right-0 left-0 md:left-auto md:w-80 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-5 z-50 space-y-4"
                    >
                      <div className="flex items-start justify-between border-b border-gray-50 pb-3">
                        <div>
                          <h4 className="font-serif text-sm font-semibold text-gray-900">Jumlah Tamu</h4>
                          <p className="text-[10px] text-gray-400">Total anak-anak & dewasa</p>
                        </div>
                        <div className="px-2 py-0.5 bg-[#FAF8F5] rounded border border-gray-100 text-[9px] uppercase tracking-wider text-[#B89F88] font-semibold">
                          Max 20
                        </div>
                      </div>

                      {/* Stepper controls */}
                      <div className="flex items-center justify-between py-2">
                        <button
                          type="button"
                          disabled={bookingDates.guests <= 1}
                          onClick={() => setBookingDates({ ...bookingDates, guests: bookingDates.guests - 1 })}
                          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                            bookingDates.guests <= 1 
                              ? 'border-gray-100 text-gray-300 cursor-not-allowed' 
                              : 'border-[#E5D5C5] text-[#1A1A1A] hover:bg-[#FAF8F5] hover:border-[#B89F88]'
                          }`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col items-center">
                          <span className="font-serif text-3xl font-bold text-gray-900 leading-none">
                            {bookingDates.guests}
                          </span>
                          <span className="text-[10px] text-gray-400 font-light mt-1">Orang</span>
                        </div>

                        <button
                          type="button"
                          disabled={bookingDates.guests >= 20}
                          onClick={() => setBookingDates({ ...bookingDates, guests: bookingDates.guests + 1 })}
                          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                            bookingDates.guests >= 20 
                              ? 'border-gray-100 text-gray-300 cursor-not-allowed' 
                              : 'border-[#E5D5C5] text-[#1A1A1A] hover:bg-[#FAF8F5] hover:border-[#B89F88]'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Capacities notice banner */}
                      {bookingDates.guests >= 20 ? (
                        <div className="p-2.5 bg-amber-50 rounded-lg text-[10px] text-amber-800 flex items-start space-x-2 border border-amber-200">
                          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>Anda telah mencapai batas maksimal kapasitas villa (20 orang).</span>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-[#FDFBF7] rounded-lg text-[10px] text-gray-500 flex items-start space-x-2 border border-[#E5D5C5]/30">
                          <Info className="w-3.5 h-3.5 text-[#B89F88] shrink-0 mt-0.5" />
                          <span>Casa Dream Villa menyediakan sewa seluruh area properti secara privat maksimal untuk 20 orang tamu.</span>
                        </div>
                      )}

                      {/* Jump Presets Quick Select */}
                      <div className="space-y-1.5 border-t border-gray-50 pt-3">
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-medium">Pilih Cepat:</span>
                        <div className="grid grid-cols-4 gap-2">
                          {[2, 5, 10, 20].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setBookingDates({ ...bookingDates, guests: num })}
                              className={`py-1.5 px-1 text-xs font-semibold rounded-md transition-all ${
                                bookingDates.guests === num
                                  ? 'bg-[#62462b] text-white'
                                  : 'bg-[#FDFBF7] hover:bg-[#F5F1EB] text-gray-700 border border-[#E5D5C5]/30'
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
                        className="w-full py-2 bg-[#62462b] hover:bg-[#7c5d41] text-white font-medium text-xs rounded transition-colors"
                      >
                        Selesai
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-4 bg-[#62462b] hover:bg-[#7c5d41] text-white font-semibold text-xs tracking-[0.25em] uppercase transition-all duration-300 rounded-lg shadow-lg border border-transparent min-h-[50px] flex items-center justify-center"
              >
                CARI SANCTUARY
              </button>
            </div>
          </form>

          {/* Availability Status Toast */}
          {availabilityMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3.5 bg-green-50 border border-green-200 rounded-md text-green-800 text-xs flex items-center space-x-2.5"
            >
              <ShieldCheck className="w-4.5 h-4.5 text-green-600 shrink-0" />
              <span className="font-light">{availabilityMessage}</span>
            </motion.div>
          )}
        </div>
      </section>

      {/* 3. THE COLLECTIONS (SUITES SECTIONS) */}
      <section id="suites-section" className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#62462b] font-semibold">The Collections</span>
          <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-gray-900">
            Elegant Living Curated for Comfort
          </h2>
          <div className="w-16 h-0.5 bg-[#62462b] mx-auto mt-4" />
        </div>

        {/* Centered Single Villa Showcase */}
        <div className="max-w-4xl mx-auto">
          {suitesData.map((suite) => (
            <motion.div
              key={suite.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row gap-8 items-center bg-white rounded-t-[10rem] rounded-b-xl overflow-hidden border border-[#D3C4B9]/30 shadow-2xl p-6 md:p-8"
            >
              {/* Image Container */}
              <div 
                onClick={() => handleSuiteExplore(suite.id)}
                className="group relative w-full md:w-1/2 h-[350px] md:h-[450px] rounded-t-[8rem] rounded-b-md overflow-hidden cursor-pointer shadow-md bg-[#FFF8F5] shrink-0"
              >
                {suite.image ? (
                  <img 
                    src={suite.image} 
                    alt={suite.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1C1C1C] to-[#2C2C2C] flex flex-col items-center justify-center p-8 text-center">
                    <Sparkles className="w-8 h-8 text-[#ffdcc0]/40 mb-3 animate-pulse" />
                    <span className="font-serif text-lg tracking-[0.2em] text-[#ffdcc0] uppercase font-light">Casa Dream Villa</span>
                    <span className="text-[10px] tracking-widest text-gray-500 uppercase mt-1">Image Pending Upload</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <span className="text-white text-xs tracking-[0.2em] uppercase font-light flex items-center space-x-2">
                    <span>Click to view details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#ffdcc0]" />
                  </span>
                </div>
              </div>

              {/* Info Block */}
              <div className="space-y-6 flex-1 py-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-[#62462b] font-semibold">
                    <span>{suite.size}</span>
                    <span>•</span>
                    <span>{suite.capacity}</span>
                    <span>•</span>
                    <span>{suite.bedType}</span>
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl text-gray-900 tracking-tight font-medium">
                    {suite.name}
                  </h3>
                  <div className="w-12 h-0.5 bg-[#62462b]" />
                </div>

                <p className="text-xs md:text-sm text-gray-500 font-light leading-relaxed">
                  {suite.description}
                </p>

                {/* Amenities checklist overview */}
                <div className="grid grid-cols-2 gap-2 pt-2 pb-4">
                  {suite.amenities.slice(0, 4).map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2 text-xs text-gray-600 font-light">
                      <Check className="w-3.5 h-3.5 text-[#62462b]" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-[#D3C4B9]/30 pt-6 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest block">Mulai dari</span>
                    <span className="font-serif text-xl md:text-2xl font-bold text-[#62462b]">{formatRupiah(suite.price)}</span>
                    <span className="text-[10px] text-gray-500 block">/ malam (Weekdays)</span>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-400 pt-1.5 font-light">
                      <span>• Jumat: <strong className="text-gray-700">{formatRupiah(3800000)}</strong></span>
                      <span>• Weekend: <strong className="text-gray-700">{formatRupiah(5000000)}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSuiteExplore(suite.id)}
                    className="px-6 py-3 bg-[#62462b] hover:bg-[#7c5d41] text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-md shadow-lg shrink-0 self-start sm:self-center"
                  >
                    EXPLORE DETAILS
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. FASILITAS VILLA CASA DREAM */}
      <section id="facilities-section" className="py-24 bg-[#fbf2ed] px-6 md:px-12 border-t border-[#D3C4B9]/30">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Header Block */}
          <div className="text-center space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-[#62462b] font-semibold">Exquisite Inclusions</span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-gray-900 leading-none">
              Fasilitas Villa Casa Dream
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-light max-w-xl mx-auto leading-relaxed">
              Nikmati fasilitas lengkap untuk kenyamanan dan pengalaman menginap terbaik
            </p>
            <div className="w-16 h-0.5 bg-[#62462b] mx-auto mt-4" />
          </div>

          {/* Main Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Luas Tanah', value: '500 m²', icon: Maximize2 },
              { label: 'Kamar Tidur', value: '4 Kamar', icon: Bed },
              { label: 'Kamar Mandi', value: '5 Kamar', icon: Bath },
              { label: 'Kapasitas', value: '20 Orang', icon: Users },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 md:p-8 border border-[#D3C4B9]/30 shadow-md shadow-[#62462b]/5 flex flex-col items-center text-center group hover:border-[#62462b] hover:shadow-lg hover:shadow-[#62462b]/10 transition-all duration-300"
              >
                <div className="p-4 bg-[#fbf2ed] rounded-full text-[#62462b] group-hover:bg-[#62462b] group-hover:text-white transition-all duration-300 mb-4">
                  <metric.icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest font-sans font-medium mb-1">
                  {metric.label}
                </span>
                <span className="font-serif text-lg md:text-xl font-bold text-[#1A1A1A] tracking-tight">
                  {metric.value}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Detailed Facilities List */}
          <div className="bg-white rounded-2xl border border-[#D3C4B9]/30 shadow-xl shadow-[#62462b]/5 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 md:gap-y-6">
                     {/* Column 1 */}
              <div className="space-y-4 md:space-y-6">
                {[
                  { text: 'Parking Area', icon: Car },
                  { text: 'Free Extra Bed (10)', icon: Bed },
                  { text: 'Televisi 4K + Free Netflix & YouTube', icon: Tv },
                  { text: 'Premium Billiard Table', icon: Sparkles },
                  { text: '4 Kamar Mandi + 1 Kamar Mandi Tamu', icon: Bath },
                  { text: 'Water Heater Premium', icon: Thermometer },
                  { text: 'Sabun Mandi & Shampoo', icon: Sparkles },
                  { text: 'Setrika Uap (On Request)', icon: Wind },
                  { text: 'Jacuzzi Whirlpool', icon: Waves },
                  { text: 'Backyard & Grill Area (Lantai 3)', icon: Trees },
                  { text: 'Alat Masak Lengkap', icon: Utensils },
                  { text: 'Kulkas & Dispenser', icon: Droplet },
                ].map((item, idx) => (
                  <motion.div 
                    key={item.text}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="flex items-center space-x-4 group p-1.5 rounded-md hover:bg-[#fbf2ed] transition-colors duration-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#fbf2ed] text-[#62462b] flex items-center justify-center shrink-0 border border-[#D3C4B9]/20 group-hover:bg-[#62462b] group-hover:text-white transition-all duration-300">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs md:text-sm text-gray-700 font-sans tracking-wide font-light group-hover:text-black transition-colors">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Column 2 */}
              <div className="space-y-4 md:space-y-6">
                {[
                  { text: 'Free Wi-Fi Internet', icon: Wifi },
                  { text: 'Premium Living Room with Premium Sofa', icon: Sofa },
                  { text: 'Premium Karaoke (Mixer)', icon: Music },
                  { text: '4 Kamar Tidur AC + Kasur & Seprai Hotel', icon: Bed },
                  { text: 'Playground', icon: Trees },
                  { text: '10 Towel per Hari', icon: Sparkles },
                  { text: 'Free Tissue Setiap Kamar Mandi', icon: Wind },
                  { text: 'Private Swimming Pool', icon: Waves },
                  { text: 'Shower Room Area Kolam', icon: Bath },
                  { text: 'BBQ Grill & Alat Grill Lengkap', icon: Flame },
                  { text: 'Rice Cooker, Microwave & Blender', icon: Utensils },
                  { text: 'Gratis 2 Tabung Gas & 2 Aqua', icon: Droplet },
                ].map((item, idx) => (
                  <motion.div 
                    key={item.text}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="flex items-center space-x-4 group p-1.5 rounded-md hover:bg-[#fbf2ed] transition-colors duration-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#fbf2ed] text-[#62462b] flex items-center justify-center shrink-0 border border-[#D3C4B9]/20 group-hover:bg-[#62462b] group-hover:text-white transition-all duration-300">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs md:text-sm text-gray-700 font-sans tracking-wide font-light group-hover:text-black transition-colors">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. GUEST REVIEWS */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-[#62462b] font-semibold">Verified Sanctum Stays</span>
          <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-gray-900 leading-none">What Our Guests Say</h2>
          <div className="w-16 h-0.5 bg-[#62462b] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Reviews List (Left side) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-center pb-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700">Ulasan Tamu ({reviews.length})</h3>
              <span className="text-[10px] text-gray-400 font-light">Diurutkan berdasarkan ulasan terbaru</span>
            </div>
            
            {reviews.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-gray-100 shadow-sm text-gray-400 font-light text-xs">
                Belum ada ulasan terverifikasi. Jadilah yang pertama memberikan ulasan setelah menyelesaikan kunjungan Anda!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-6 md:p-8 rounded-xl border border-[#D3C4B9]/20 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex space-x-0.5 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      ))}
                      {[...Array(5 - rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-gray-200" />
                      ))}
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-[#62462b] font-bold bg-[#62462b]/5 px-2.5 py-1 rounded flex items-center space-x-1">
                      <span>Stay Verified</span>
                      <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 italic leading-relaxed font-light">
                    {rev.text}
                  </p>
                  <div className="flex justify-between items-end border-t border-gray-50 pt-3">
                    <div>
                      <h5 className="text-xs uppercase tracking-[0.1em] font-semibold text-gray-800">{rev.name}</h5>
                      {rev.suiteName && <p className="text-[10px] text-[#62462b] font-medium mt-0.5">{rev.suiteName}</p>}
                    </div>
                    <span className="text-[10px] text-gray-400 font-light">{rev.origin} • {rev.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Write a Review widget (Right side) */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl border border-[#D3C4B9]/30 shadow-lg space-y-6 sticky top-24">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#62462b] font-bold flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>KOLOM ULASAN TAMU</span>
              </span>
              <h3 className="font-serif text-xl text-gray-900 font-semibold">Bagikan Pengalaman Anda</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Kami mengundang Anda untuk meninggalkan ulasan autentik mengenai pelayanan, kenyamanan, dan pengalaman menginap Anda bersama Casa Dream.
              </p>
            </div>

            {reviewError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 text-xs text-red-600">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{reviewError}</span>
              </div>
            )}

            {/* DIRECT WRITE REVIEW FORM */}
            {!reviewSuccess && (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Guest Name Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">Nama Lengkap Anda</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bambang Wijaya"
                    value={reviewGuestName}
                    onChange={(e) => setReviewGuestName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-gray-200 text-xs py-3 px-4 rounded-md focus:outline-none focus:border-[#62462b] transition-colors"
                  />
                </div>

                {/* Star Rating Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">Rating Anda</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-110 transition-transform focus:outline-none cursor-pointer text-amber-500"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newRating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Origin Input (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">Asal Kota / Negara</label>
                  <input
                    type="text"
                    placeholder="e.g. Bandung, Indonesia"
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-gray-200 text-xs py-3 px-4 rounded-md focus:outline-none focus:border-[#62462b] transition-colors"
                  />
                </div>

                {/* Review Text Area */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">Ulasan / Testimoni</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Bagikan pengalaman menginap Anda..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-gray-200 p-3.5 rounded-md focus:outline-none focus:border-[#62462b] text-xs font-light"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#62462b] hover:bg-[#7c5d41] text-white font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 rounded-md shadow flex items-center justify-center space-x-2 cursor-pointer mt-2"
                >
                  <span>KIRIM ULASAN SEKARANG</span>
                </button>
              </form>
            )}

            {/* SUCCESS STATE */}
            {reviewSuccess && (
              <div className="text-center py-6 space-y-3">
                <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-lg font-bold text-gray-900">Ulasan Sukses Dikirim!</h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  Terima kasih telah membagikan ulasan berharga Anda. Ulasan Anda telah dipasang secara langsung pada daftar testimoni terverifikasi kami di sebelah kiri.
                </p>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-[#62462b] text-white rounded-2xl px-8 py-16 md:p-16 text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-44 h-44 rounded-full bg-white/5 blur-xl" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-[#1A1A1A]/5 blur-2xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#ffdcc0] font-semibold">Exquisite Mountain Getaway</span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-none text-white">
              Ready for your private retreat?
            </h2>
            <p className="text-xs md:text-sm text-gray-200 font-light leading-relaxed max-w-lg mx-auto">
              Secure your preferred suite collection today. Experience Indonesian-inspired quiet luxury and absolute privacy.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                setView('suite-detail', 'jimbaran-suite');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-[#ffdcc0] text-[#2b1703] hover:bg-[#e7bf9d] font-semibold text-xs tracking-[0.2em] uppercase transition-colors rounded-sm shadow-md"
            >
              BOOK YOUR STAY TODAY
            </button>
            <button
              id="cta-chat-with-us-btn"
              onClick={() => {
                const chatBtn = document.getElementById('floating-concierge-chat-button');
                if (chatBtn) chatBtn.click();
              }}
              className="w-full sm:w-auto px-8 py-4 bg-transparent text-white hover:bg-white/10 font-semibold text-xs tracking-[0.2em] uppercase border border-white/40 transition-colors rounded-sm"
            >
              CHAT WITH US
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
