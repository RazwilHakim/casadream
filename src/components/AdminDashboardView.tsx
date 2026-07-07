import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Users, CalendarRange, Clock, Search, Filter, 
  CheckCircle, XCircle, Trash2, Eye, LogOut, Plus, RefreshCw, 
  FileText, Sparkles, User, ShieldAlert, Check, X, Calendar, 
  ArrowRight, ShieldCheck, Download, AlertCircle, Phone, Mail,
  Star, MessageSquare
} from 'lucide-react';
import { Booking, Suite } from '../types';
import { formatRupiah, formatDisplayDate } from '../utils';

interface AdminDashboardViewProps {
  setView: (view: string) => void;
  adminUser: { username: string; role: string; fullName: string } | null;
  onLogout: () => void;
}

// Suite details mapping to help calculate/fill details easily
const SUITES_POOL = [
  { id: 'casa-dream-villa', name: 'Jimbaran Private Pool Suite', price: 3500000 },
  { id: 'jimbaran-suite', name: 'Jimbaran Private Pool Suite', price: 3500000 },
  { id: 'ubud-suite', name: 'Ubud Forest Escape Suite', price: 3300000 },
  { id: 'canggu-suite', name: 'Canggu Ocean Breeze Suite', price: 3100000 }
];

export default function AdminDashboardView({ setView, adminUser, onLogout }: AdminDashboardViewProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [suiteFilter, setSuiteFilter] = useState('all');
  const [selectedReceipt, setSelectedReceipt] = useState<{ name: string; url?: string } | null>(null);
  
  // Custom states for guest reviews moderation
  const [activeTab, setActiveTab] = useState<'reservations' | 'reviews'>('reservations');
  const [reviews, setReviews] = useState<any[]>([]);
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);

  // Load reviews from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('casa_dream_reviews');
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaults = [
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
      setReviews(defaults);
      localStorage.setItem('casa_dream_reviews', JSON.stringify(defaults));
    }
  }, []);

  // Custom modal dialog states to replace iframe-incompatible window.confirm and window.prompt
  const [deleteConfirmInvoice, setDeleteConfirmInvoice] = useState<string | null>(null);
  const [rejectConfirmInvoice, setRejectConfirmInvoice] = useState<string | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState('Bukti transfer kurang jelas atau tidak sesuai nominal.');
  const [clearDatabaseConfirm, setClearDatabaseConfirm] = useState(false);
  const [resetDatabaseConfirm, setResetDatabaseConfirm] = useState(false);

  // Create Manual Booking Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newSuiteId, setNewSuiteId] = useState('jimbaran-suite');
  const [newCheckIn, setNewCheckIn] = useState('2026-07-12');
  const [newCheckOut, setNewCheckOut] = useState('2026-07-14');
  const [newGuests, setNewGuests] = useState(2);
  const [newPaymentMethod, setNewPaymentMethod] = useState<'bank_transfer' | 'qris'>('bank_transfer');

  // Load Bookings from local storage or initialize with rich realistic defaults
  useEffect(() => {
    const stored = localStorage.getItem('casa_dream_bookings');
    if (stored) {
      try {
        setBookings(JSON.parse(stored));
      } catch (err) {
        console.error("Error parsing stored bookings", err);
        initializeDefaultBookings();
      }
    } else {
      initializeDefaultBookings();
    }
  }, []);

  const initializeDefaultBookings = () => {
    const defaults = [
      {
        suiteId: 'jimbaran-suite',
        suiteName: 'Jimbaran Private Pool Suite',
        suitePrice: 3500000,
        checkIn: '2026-07-08',
        checkOut: '2026-07-11',
        guests: 2,
        guestName: 'Ahmad Subarjo',
        guestEmail: 'ahmad.subarjo@yahoo.com',
        guestPhone: '+62 811-234-5678',
        paymentMethod: 'bank_transfer',
        paymentReceiptName: 'transfer_bca_ahmad_subarjo.jpg',
        invoiceNumber: 'CASA-2026-8841',
        totalNights: 3,
        baseRateTotal: 10500000,
        serviceCleaningFee: 250000,
        totalAmount: 10750000,
        status: 'pending', // Pending Admin Approval
        createdAt: new Date().toISOString()
      },
      {
        suiteId: 'ubud-suite',
        suiteName: 'Ubud Forest Escape Suite',
        suitePrice: 3300000,
        checkIn: '2026-07-15',
        checkOut: '2026-07-17',
        guests: 3,
        guestName: 'Siti Rahmawati',
        guestEmail: 'siti.rahma@gmail.com',
        guestPhone: '+62 812-9876-5432',
        paymentMethod: 'qris',
        paymentReceiptName: 'qris_gopay_receipt_siti.png',
        invoiceNumber: 'CASA-2026-5592',
        totalNights: 2,
        baseRateTotal: 6600000,
        serviceCleaningFee: 250000,
        totalAmount: 6850000,
        status: 'confirmed', // Confirmed / Paid
        createdAt: new Date().toISOString()
      },
      {
        suiteId: 'canggu-suite',
        suiteName: 'Canggu Ocean Breeze Suite',
        suitePrice: 3100000,
        checkIn: '2026-07-01',
        checkOut: '2026-07-04',
        guests: 2,
        guestName: 'Kevin Wijaya',
        guestEmail: 'kevin.wijaya@outlook.com',
        guestPhone: '+62 813-1111-2222',
        paymentMethod: 'bank_transfer',
        paymentReceiptName: 'mandiri_transfer_proof.pdf',
        invoiceNumber: 'CASA-2026-3112',
        totalNights: 3,
        baseRateTotal: 9300000,
        serviceCleaningFee: 250000,
        totalAmount: 9550000,
        status: 'checked_out', // Completed
        createdAt: new Date().toISOString()
      },
      {
        suiteId: 'jimbaran-suite',
        suiteName: 'Jimbaran Private Pool Suite',
        suitePrice: 3500000,
        checkIn: '2026-07-05',
        checkOut: '2026-07-07',
        guests: 4,
        guestName: 'Hendra Setiawan',
        guestEmail: 'hendra_s@gmail.com',
        guestPhone: '+62 812-4455-6677',
        paymentMethod: 'qris',
        paymentReceiptName: 'qris_ovo_hendra.jpg',
        invoiceNumber: 'CASA-2026-9041',
        totalNights: 2,
        baseRateTotal: 7000000,
        serviceCleaningFee: 250000,
        totalAmount: 7250000,
        status: 'checked_in', // Guest currently staying
        createdAt: new Date().toISOString()
      }
    ];
    setBookings(defaults);
    localStorage.setItem('casa_dream_bookings', JSON.stringify(defaults));
  };

  // Helper to save current bookings to localStorage and state
  const saveBookings = (newBookings: any[]) => {
    setBookings(newBookings);
    localStorage.setItem('casa_dream_bookings', JSON.stringify(newBookings));
  };

  // Action handlers
  const handleApprove = (invoiceNum: string) => {
    const updated = bookings.map(b => {
      if (b.invoiceNumber === invoiceNum) {
        return { ...b, status: 'confirmed' };
      }
      return b;
    });
    saveBookings(updated);
  };

  const handleReject = (invoiceNum: string) => {
    setRejectConfirmInvoice(invoiceNum);
    setRejectReasonText('Bukti transfer kurang jelas atau tidak sesuai nominal.');
  };

  const handleRejectConfirm = () => {
    if (!rejectConfirmInvoice) return;
    const updated = bookings.map(b => {
      if (b.invoiceNumber === rejectConfirmInvoice) {
        return { ...b, status: 'cancelled', adminNotes: rejectReasonText || 'Bukti bayar ditolak.' };
      }
      return b;
    });
    saveBookings(updated);
    setRejectConfirmInvoice(null);
  };

  const handleCheckIn = (invoiceNum: string) => {
    const updated = bookings.map(b => {
      if (b.invoiceNumber === invoiceNum) {
        return { ...b, status: 'checked_in' };
      }
      return b;
    });
    saveBookings(updated);
  };

  const handleCheckOut = (invoiceNum: string) => {
    const updated = bookings.map(b => {
      if (b.invoiceNumber === invoiceNum) {
        return { ...b, status: 'checked_out' };
      }
      return b;
    });
    saveBookings(updated);
  };

  const handleDelete = (invoiceNum: string) => {
    setDeleteConfirmInvoice(invoiceNum);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmInvoice) return;
    const filtered = bookings.filter(b => b.invoiceNumber !== deleteConfirmInvoice);
    saveBookings(filtered);
    setDeleteConfirmInvoice(null);
  };

  const handleClearAllBookings = () => {
    saveBookings([]);
    setClearDatabaseConfirm(false);
  };

  const handleResetToDefaults = () => {
    initializeDefaultBookings();
    setResetDatabaseConfirm(false);
  };

  const handleDeleteReviewConfirm = () => {
    if (!deleteReviewId) return;
    const filteredReviews = reviews.filter(rev => rev.id !== deleteReviewId);
    setReviews(filteredReviews);
    localStorage.setItem('casa_dream_reviews', JSON.stringify(filteredReviews));
    setDeleteReviewId(null);
  };

  // Create Manual Booking Submitter
  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGuestName.trim() || !newGuestEmail.trim() || !newGuestPhone.trim()) {
      alert("Mohon lengkapi semua data tamu.");
      return;
    }

    const selectedSuite = SUITES_POOL.find(s => s.id === newSuiteId) || SUITES_POOL[0];
    
    // Calculate nights and prices
    const checkInDate = new Date(newCheckIn);
    const checkOutDate = new Date(newCheckOut);
    let totalNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    if (totalNights <= 0) totalNights = 1;

    const baseRateTotal = selectedSuite.price * totalNights;
    const serviceCleaningFee = 250000;
    const totalAmount = baseRateTotal + serviceCleaningFee;
    const randomInvoice = 'CASA-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const manualBooking = {
      suiteId: selectedSuite.id,
      suiteName: selectedSuite.name,
      suitePrice: selectedSuite.price,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      guests: newGuests,
      guestName: newGuestName,
      guestEmail: newGuestEmail,
      guestPhone: newGuestPhone,
      paymentMethod: newPaymentMethod,
      paymentReceiptName: `manual_concierge_override_${adminUser?.username || 'admin'}.png`,
      invoiceNumber: randomInvoice,
      totalNights,
      baseRateTotal,
      serviceCleaningFee,
      totalAmount,
      status: 'confirmed', // Manual bookings are auto-confirmed by staff
      createdAt: new Date().toISOString()
    };

    const updated = [manualBooking, ...bookings];
    saveBookings(updated);
    setCreateModalOpen(false);
    
    // Clear form
    setNewGuestName('');
    setNewGuestEmail('');
    setNewGuestPhone('');
    
    alert(`Sukses membuat reservasi offline manual: ${randomInvoice}`);
  };

  const handleExportCSV = () => {
    // Generate headers
    const headers = ['Invoice', 'Nama Tamu', 'Email', 'Telepon', 'Suite', 'Check In', 'Check Out', 'Malam', 'Tamu', 'Total Biaya', 'Metode', 'Status'];
    
    // Generate rows
    const rows = bookings.map(b => [
      b.invoiceNumber,
      `"${b.guestName.replace(/"/g, '""')}"`,
      b.guestEmail,
      b.guestPhone,
      `"${b.suiteName.replace(/"/g, '""')}"`,
      b.checkIn,
      b.checkOut,
      b.totalNights,
      b.guests,
      b.totalAmount,
      b.paymentMethod,
      b.status
    ]);
    
    // Combine to CSV format using standard encoding
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Casa_Dream_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("Laporan Excel/CSV sukses diekspor ke folder unduhan Anda.");
  };

  // Statistics calculation
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'checked_in' || b.status === 'checked_out')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const activeStayCount = bookings.filter(b => b.status === 'checked_in').length;
  const totalBookingsCount = bookings.length;

  // Filter and search bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.guestPhone.includes(searchTerm) ||
      b.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSuite = suiteFilter === 'all' || b.suiteId === suiteFilter;

    return matchesSearch && matchesStatus && matchesSuite;
  });

  return (
    <div id="admin-dashboard-view" className="bg-[#FFF8F5] text-[#1E1B18] min-h-screen py-10 px-4 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Dashboard Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-[#D3C4B9]/30">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-[#62462b]/10 text-[#62462b] text-[10px] uppercase tracking-widest font-bold rounded-full">
                {adminUser?.role || 'Super Admin'}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 font-mono font-light flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" /> Puncak Hill Control Active
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-gray-900 tracking-tight font-semibold">
              Sistem Manajemen Reservasi
            </h1>
            <p className="text-xs text-gray-500 font-light">
              Selamat datang kembali, <strong className="text-[#62462b] font-medium">{adminUser?.fullName || 'Bambang Sudarsono'}</strong>. Kelola properti dan verifikasi pembayaran.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-5 py-3 bg-[#62462b] hover:bg-[#7c5d41] text-white text-xs font-semibold tracking-wider uppercase rounded-full flex items-center space-x-2 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Input Reservasi Manual</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-5 py-3 bg-white hover:bg-[#62462b]/5 border border-[#62462b]/40 text-[#62462b] text-xs font-semibold tracking-wider uppercase rounded-full flex items-center space-x-2 transition-all cursor-pointer"
              title="Ekspor Seluruh Data ke Excel/CSV"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Excel/CSV</span>
            </button>
            <button
              onClick={() => setClearDatabaseConfirm(true)}
              className="px-5 py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold tracking-wider uppercase rounded-full flex items-center space-x-2 transition-all cursor-pointer"
              title="Kosongkan Semua Data Booking"
            >
              <Trash2 className="w-4 h-4" />
              <span>Kosongkan DB</span>
            </button>
            <button
              onClick={() => setResetDatabaseConfirm(true)}
              className="p-3 bg-white hover:bg-gray-50 border border-gray-200 text-[#62462b] hover:text-[#7c5d41] rounded-full transition-colors flex items-center justify-center cursor-pointer"
              title="Isi Ulang Data Contoh (Reset)"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onLogout}
              className="px-5 py-3 bg-white hover:bg-red-50 border border-red-200 text-red-600 text-xs font-semibold tracking-wider uppercase rounded-full flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Dashboard Statistics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Revenue */}
          <div className="bg-white p-6 rounded-2xl border border-[#D3C4B9]/20 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-[#81756c] font-semibold block">Total Pendapatan</span>
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-gray-950">{formatRupiah(totalRevenue)}</h3>
              <span className="text-[10px] text-gray-400 block pt-1">Dari seluruh pembayaran lunas</span>
            </div>
          </div>

          {/* Card 2: Pending Approval */}
          <div className="bg-white p-6 rounded-2xl border border-[#D3C4B9]/20 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-[#81756c] font-semibold block">Menunggu Persetujuan</span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${pendingCount > 0 ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-gray-50 text-gray-400'}`}>
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-gray-950">{pendingCount} Pesanan</h3>
              <span className="text-[10px] text-gray-400 block pt-1">Perlu review bukti pembayaran</span>
            </div>
          </div>

          {/* Card 3: Active Guest Stays */}
          <div className="bg-white p-6 rounded-2xl border border-[#D3C4B9]/20 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-[#81756c] font-semibold block">Tamu Sedang Menginap</span>
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-gray-950">{activeStayCount} Suite</h3>
              <span className="text-[10px] text-gray-400 block pt-1">Status check-in aktif di resort</span>
            </div>
          </div>

          {/* Card 4: Total bookings count */}
          <div className="bg-white p-6 rounded-2xl border border-[#D3C4B9]/20 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-[#81756c] font-semibold block">Total Transaksi</span>
              <div className="w-10 h-10 rounded-full bg-[#62462b]/5 text-[#62462b] flex items-center justify-center">
                <CalendarRange className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-gray-950">{totalBookingsCount} Reservasi</h3>
              <span className="text-[10px] text-gray-400 block pt-1">Terdaftar dalam database lokal</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#D3C4B9]/30">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`py-3.5 px-6 font-serif text-sm font-semibold tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'reservations'
                ? 'border-[#62462b] text-[#62462b]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <CalendarRange className="w-4 h-4" />
            <span>Daftar Reservasi ({filteredBookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-6 font-serif text-sm font-semibold tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'reviews'
                ? 'border-[#62462b] text-[#62462b]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Moderasi Ulasan Tamu ({reviews.length})</span>
          </button>
        </div>

        {activeTab === 'reservations' && (
          <>
            {/* Filters and Search toolbar */}
            <div className="bg-white p-5 rounded-2xl border border-[#D3C4B9]/30 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search box */}
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Cari berdasarkan nama tamu, email, nomor invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-gray-200 text-xs py-3 pl-10 pr-4 rounded-md focus:outline-none focus:border-[#62462b] transition-colors"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center">
                <Filter className="w-3.5 h-3.5 mr-1" /> Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#FAF8F5] border border-gray-200 text-xs py-2 px-3.5 rounded-md focus:outline-none focus:border-[#62462b]"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Review Pembayaran</option>
                <option value="confirmed">Pembayaran Disetujui</option>
                <option value="checked_in">Sedang Menginap</option>
                <option value="checked_out">Selesai Menginap</option>
                <option value="cancelled">Dibatalkan / Ditolak</option>
              </select>
            </div>

            {/* Suite Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Suite:</span>
              <select
                value={suiteFilter}
                onChange={(e) => setSuiteFilter(e.target.value)}
                className="bg-[#FAF8F5] border border-gray-200 text-xs py-2 px-3.5 rounded-md focus:outline-none focus:border-[#62462b]"
              >
                <option value="all">Semua Suite</option>
                <option value="jimbaran-suite">Jimbaran Pool Suite</option>
                <option value="ubud-suite">Ubud Escape Suite</option>
                <option value="canggu-suite">Canggu Ocean Suite</option>
              </select>
            </div>
          </div>
        </div>

        {/* Detailed Bookings Table List */}
        <div className="bg-white rounded-2xl border border-[#D3C4B9]/30 shadow-xl overflow-hidden">
          
          {filteredBookings.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <AlertCircle className="w-12 h-12 text-[#62462b]/30 mx-auto" />
              <h3 className="font-serif text-xl font-semibold text-gray-800">Tidak ada reservasi ditemukan</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto font-light">Tidak ada data pemesanan yang cocok dengan kriteria pencarian atau filter aktif Anda.</p>
              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); setSuiteFilter('all'); }}
                className="px-4 py-2 text-[#62462b] bg-[#62462b]/5 hover:bg-[#62462b]/10 text-xs font-semibold rounded-md uppercase tracking-wider"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-gray-100 text-[10px] uppercase tracking-wider text-[#81756c] font-semibold font-mono">
                    <th className="py-4.5 px-6">Invoice & Tamu</th>
                    <th className="py-4.5 px-6">Detail Suite</th>
                    <th className="py-4.5 px-6">Masa Tinggal & Tamu</th>
                    <th className="py-4.5 px-6">Pembayaran</th>
                    <th className="py-4.5 px-6">Status</th>
                    <th className="py-4.5 px-6 text-right">Aksi Kelola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {filteredBookings.map((b) => {
                    const statusConfig = {
                      pending: { bg: 'bg-amber-50 border-amber-200 text-amber-800', label: 'Review Pembayaran' },
                      confirmed: { bg: 'bg-green-50 border-green-200 text-green-800', label: 'Pembayaran Disetujui' },
                      checked_in: { bg: 'bg-blue-50 border-blue-200 text-blue-800', label: 'Sedang Menginap' },
                      checked_out: { bg: 'bg-gray-100 border-gray-200 text-gray-600', label: 'Selesai Menginap' },
                      cancelled: { bg: 'bg-red-50 border-red-200 text-red-800', label: 'Ditolak / Batal' }
                    }[b.status as 'pending'|'confirmed'|'checked_in'|'checked_out'|'cancelled'] || { bg: 'bg-gray-50 border-gray-100 text-gray-600', label: b.status };

                    return (
                      <tr key={b.invoiceNumber} className="hover:bg-gray-50/50 transition-colors">
                        
                        {/* Guest details column */}
                        <td className="py-5 px-6 space-y-1.5">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-mono font-bold text-[#62462b] text-xs">
                              {b.invoiceNumber}
                            </span>
                          </div>
                          <div>
                            <span className="font-serif text-sm font-semibold text-gray-900 block">{b.guestName}</span>
                            <div className="flex flex-col space-y-0.5 text-[10px] text-gray-400 font-light pt-0.5">
                              <span className="flex items-center"><Mail className="w-3 h-3 mr-1" /> {b.guestEmail}</span>
                              <span className="flex items-center"><Phone className="w-3 h-3 mr-1" /> {b.guestPhone}</span>
                            </div>
                          </div>
                        </td>

                        {/* Suite Details column */}
                        <td className="py-5 px-6 space-y-1">
                          <span className="font-serif text-xs font-semibold text-gray-900 block">
                            {b.suiteName}
                          </span>
                          <span className="text-[10px] text-gray-400 block font-light">
                            Tarif: {formatRupiah(b.suitePrice || 3500000)} /malam
                          </span>
                        </td>

                        {/* Stay Period column */}
                        <td className="py-5 px-6 space-y-1">
                          <div className="flex items-center space-x-1 font-medium text-gray-800">
                            <Calendar className="w-3.5 h-3.5 text-[#62462b]/60 mr-1" />
                            <span>{b.checkIn}</span>
                            <span className="text-gray-400">sampai</span>
                            <span>{b.checkOut}</span>
                          </div>
                          <div className="text-[10px] text-gray-400 flex space-x-3 font-light">
                            <span>🌙 {b.totalNights} Malam</span>
                            <span>•</span>
                            <span>👥 {b.guests} Tamu</span>
                          </div>
                        </td>

                        {/* Payments column */}
                        <td className="py-5 px-6 space-y-1.5">
                          <strong className="text-gray-900 text-sm font-semibold font-serif block">
                            {formatRupiah(b.totalAmount)}
                          </strong>
                          <div className="flex items-center space-x-2">
                            <span className="text-[9px] uppercase tracking-wider font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {b.paymentMethod === 'qris' ? 'QRIS RAPID' : 'BANK EFT'}
                            </span>
                            {b.paymentReceiptName && (
                              <button
                                onClick={() => setSelectedReceipt({ name: b.paymentReceiptName })}
                                className="text-[10px] text-[#62462b] hover:text-[#7c5d41] hover:underline font-semibold flex items-center space-x-1"
                              >
                                <Eye className="w-3 h-3 mr-0.5" />
                                <span>Bukti</span>
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Status badge column */}
                        <td className="py-5 px-6">
                          <span className={`inline-block px-2.5 py-1 border text-[9px] font-bold uppercase tracking-wider rounded-sm ${statusConfig.bg}`}>
                            {statusConfig.label}
                          </span>
                        </td>

                        {/* Management Actions column */}
                        <td className="py-5 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Actions based on current status */}
                            {b.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(b.invoiceNumber)}
                                  className="p-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded transition-colors flex items-center space-x-1 text-[10px] font-bold px-2 uppercase"
                                  title="Setujui Pembayaran"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>SETUJUI</span>
                                </button>
                                <button
                                  onClick={() => handleReject(b.invoiceNumber)}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded transition-colors flex items-center space-x-1 text-[10px] font-bold px-2 uppercase"
                                  title="Tolak Reservasi"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>TOLAK</span>
                                </button>
                              </>
                            )}

                            {b.status === 'confirmed' && (
                              <>
                                <button
                                  onClick={() => handleCheckIn(b.invoiceNumber)}
                                  className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded transition-colors flex items-center space-x-1 text-[10px] font-bold px-2.5 uppercase"
                                  title="Proses Check-In"
                                >
                                  <span>CHECK-IN</span>
                                </button>
                                <button
                                  onClick={() => handleReject(b.invoiceNumber)}
                                  className="p-1.5 hover:bg-gray-100 text-gray-500 rounded transition-colors"
                                  title="Batalkan Reservasi"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            {b.status === 'checked_in' && (
                              <button
                                onClick={() => handleCheckOut(b.invoiceNumber)}
                                className="p-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded transition-colors flex items-center space-x-1 text-[10px] font-bold px-2.5 uppercase shadow-sm"
                                title="Proses Check-Out"
                              >
                                <span>CHECK-OUT</span>
                              </button>
                            )}

                            {/* Trash button to delete permanently */}
                            <button
                              onClick={() => handleDelete(b.invoiceNumber)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all ml-1"
                              title="Hapus Catatan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#D3C4B9]/30 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900">Daftar Testimoni & Ulasan Tamu</h3>
                <p className="text-xs text-gray-400 font-light">Kelola dan tinjau seluruh ulasan yang dikirim langsung dari halaman utama oleh pengunjung villa.</p>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-[#62462b] font-bold bg-[#62462b]/5 px-3 py-1.5 rounded font-mono">
                Total Ulasan: {reviews.length}
              </span>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#D3C4B9]/30 shadow-xl py-20 text-center space-y-4">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto" />
                <h4 className="font-serif text-lg font-semibold text-gray-800">Tidak ada ulasan terdaftar</h4>
                <p className="text-xs text-gray-400 max-w-xs mx-auto font-light">Seluruh ulasan telah di-take down atau belum ada ulasan baru yang dikirim oleh tamu.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((rev: any) => (
                  <div key={rev.id} className="bg-white p-6 rounded-2xl border border-[#D3C4B9]/20 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-gray-950">{rev.name}</h4>
                          <span className="text-[10px] text-gray-400 font-light">{rev.origin || 'Indonesia'} • {rev.date || 'Baru Saja'}</span>
                        </div>
                        <div className="flex space-x-0.5 text-amber-500">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          ))}
                          {Array.from({ length: 5 - (rev.rating || 5) }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 text-gray-200" />
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#FAF8F5] p-3 rounded-md border border-gray-100">
                        {rev.suiteName && (
                          <span className="text-[10px] uppercase tracking-wider text-[#62462b] font-bold block mb-1">
                            Properti: {rev.suiteName}
                          </span>
                        )}
                        <p className="text-xs text-gray-600 italic font-light leading-relaxed">
                          {rev.text}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-gray-50">
                      <button
                        onClick={() => setDeleteReviewId(rev.id)}
                        className="py-2 px-4 bg-red-50 hover:bg-red-100 border border-red-150 text-red-700 text-[10px] font-bold tracking-wider uppercase rounded transition-colors flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>TAKE DOWN ULASAN</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* MODAL 1: BUKTI PEMBAYARAN DIALOG */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-[#1A1A1A] text-white p-5 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#ffdcc0]" />
                <span className="font-serif text-sm font-semibold tracking-wide">Digital Receipt Verification</span>
              </div>
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 bg-[#FAF8F5] flex flex-col items-center space-y-4">
              
              {/* Virtual Mock Payment Receipt Render */}
              <div className="w-full bg-white p-5 rounded-lg border border-[#D3C4B9]/30 shadow-sm space-y-4">
                <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                  <div>
                    <h5 className="font-bold text-xs uppercase text-gray-400 tracking-wider">Metode Transfer</h5>
                    <span className="text-xs font-semibold text-gray-800">BANK TRANSFER (MANDIRI/BCA/BNI)</span>
                  </div>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold text-[8px] uppercase tracking-wider rounded">OK</span>
                </div>

                <div className="space-y-2 text-xs font-light text-gray-600">
                  <div className="flex justify-between">
                    <span>Nama File Bukti:</span>
                    <strong className="text-gray-800 font-mono text-[11px] break-all max-w-[200px] text-right">{selectedReceipt.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Nama Rekening:</span>
                    <strong className="text-gray-800 font-medium">Bapak/Ibu Terkait</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Waktu Unggah:</span>
                    <strong className="text-gray-500 font-mono">Baru saja (Real-Time Sync)</strong>
                  </div>
                </div>

                {/* Simulated Bank Receipt Voucher Image Box */}
                <div className="bg-gradient-to-tr from-[#62462b]/5 to-[#62462b]/15 h-36 rounded border border-dashed border-[#62462b]/30 flex flex-col items-center justify-center p-4 text-center">
                  <Sparkles className="w-6 h-6 text-[#62462b]/40 mb-1.5 animate-pulse" />
                  <span className="text-[11px] font-bold text-[#62462b] uppercase tracking-widest">{selectedReceipt.name}</span>
                  <span className="text-[9px] text-[#81756c] font-light leading-relaxed max-w-[250px] mt-1">Bukti Transfer Sukses Diunggah & Terbaca dengan Aman di Sistem Sandbox</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-full py-3 bg-[#62462b] hover:bg-[#7c5d41] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
              >
                Tutup Bukti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: MANUAL RESERVATION OVERRIDE CREATION */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-xl overflow-hidden shadow-2xl my-8">
            <div className="bg-[#1A1A1A] text-white p-5 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#ffdcc0]" />
                <span className="font-serif text-sm font-semibold tracking-wide">Input Reservasi Offline Baru</span>
              </div>
              <button 
                onClick={() => setCreateModalOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateManualBooking} className="p-6 md:p-8 space-y-5 text-xs text-gray-700">
              <p className="text-[11px] text-gray-400 font-light leading-relaxed bg-gray-50 p-3 rounded border border-gray-100">
                Gunakan panel ini untuk menginput pemesanan manual yang masuk dari telepon, WhatsApp, atau walk-in properti. Data yang diinput akan otomatis terkonfirmasi dan masuk ke dalam sistem pelaporan pendapatan.
              </p>

              {/* Guest Profile Section */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-gray-900 border-b border-gray-100 pb-1 text-sm flex items-center">
                  <User className="w-4 h-4 mr-1 text-[#62462b]" /> Profil Tamu Utama
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-400 tracking-wider block font-semibold">Nama Lengkap Tamu</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Raden Wijaya"
                      value={newGuestName}
                      onChange={(e) => setNewGuestName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-gray-200 py-2.5 px-3 rounded-md focus:outline-none focus:border-[#62462b] text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-400 tracking-wider block font-semibold">Nomor Telepon (WhatsApp)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +62 812-xxxx-xxxx"
                      value={newGuestPhone}
                      onChange={(e) => setNewGuestPhone(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-gray-200 py-2.5 px-3 rounded-md focus:outline-none focus:border-[#62462b] text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 tracking-wider block font-semibold">Alamat Email Tamu</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. guest@domain.com"
                    value={newGuestEmail}
                    onChange={(e) => setNewGuestEmail(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-gray-200 py-2.5 px-3 rounded-md focus:outline-none focus:border-[#62462b] text-xs"
                  />
                </div>
              </div>

              {/* Booking Specifications */}
              <div className="space-y-3 pt-2">
                <h4 className="font-serif font-bold text-gray-900 border-b border-gray-100 pb-1 text-sm flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-[#62462b]" /> Spesifikasi Villa & Tanggal
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Suite */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-400 tracking-wider block font-semibold">Pilih Suite Collection</label>
                    <select
                      value={newSuiteId}
                      onChange={(e) => setNewSuiteId(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-gray-200 py-2.5 px-3 rounded-md focus:outline-none focus:border-[#62462b] text-xs"
                    >
                      {SUITES_POOL.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({formatRupiah(s.price)} /malam)</option>
                      ))}
                    </select>
                  </div>

                  {/* Guests Count */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-400 tracking-wider block font-semibold">Jumlah Tamu</label>
                    <select
                      value={newGuests}
                      onChange={(e) => setNewGuests(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] border border-gray-200 py-2.5 px-3 rounded-md focus:outline-none focus:border-[#62462b] text-xs"
                    >
                      {[1, 2, 3, 4, 5, 6].map(n => (
                        <option key={n} value={n}>{n} Orang</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Check-In Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-400 tracking-wider block font-semibold">Tanggal Check-In</label>
                    <input
                      type="date"
                      required
                      value={newCheckIn}
                      onChange={(e) => setNewCheckIn(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-gray-200 py-2.5 px-3 rounded-md focus:outline-none focus:border-[#62462b] text-xs"
                    />
                  </div>

                  {/* Check-Out Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-400 tracking-wider block font-semibold">Tanggal Check-Out</label>
                    <input
                      type="date"
                      required
                      value={newCheckOut}
                      onChange={(e) => setNewCheckOut(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-gray-200 py-2.5 px-3 rounded-md focus:outline-none focus:border-[#62462b] text-xs"
                    />
                  </div>
                </div>

                {/* Settlement type */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 tracking-wider block font-semibold">Metode Settlement Pembayaran</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewPaymentMethod('bank_transfer')}
                      className={`py-2 px-3 border rounded text-xs transition-all ${
                        newPaymentMethod === 'bank_transfer'
                          ? 'bg-[#62462b]/10 border-[#62462b] text-gray-900 font-bold'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-500'
                      }`}
                    >
                      Manual Bank Transfer
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPaymentMethod('qris')}
                      className={`py-2 px-3 border rounded text-xs transition-all ${
                        newPaymentMethod === 'qris'
                          ? 'bg-[#62462b]/10 border-[#62462b] text-gray-900 font-bold'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-500'
                      }`}
                    >
                      Instant QRIS Scan
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit panel */}
              <div className="pt-4 border-t border-gray-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold uppercase tracking-wider rounded hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#62462b] hover:bg-[#7c5d41] text-white font-semibold uppercase tracking-wider rounded shadow-md transition-colors"
                >
                  Konfirmasi Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM MODAL A: DELETE SINGLE RESERVATION CONFIRMATION */}
      {deleteConfirmInvoice && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm overflow-hidden shadow-2xl flex flex-col p-6 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-gray-900">Hapus Catatan Reservasi?</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              Apakah Anda yakin ingin menghapus permanen catatan reservasi dengan nomor invoice <strong className="font-mono text-gray-900">{deleteConfirmInvoice}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmInvoice(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-xs font-semibold uppercase tracking-wider rounded hover:bg-gray-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider rounded shadow cursor-pointer"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM MODAL B: REJECT / CORRECTION EXPLANATION INPUT */}
      {rejectConfirmInvoice && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-md overflow-hidden shadow-2xl flex flex-col p-6 space-y-4">
            <div className="flex items-center space-x-3 text-amber-600">
              <XCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-gray-900">Koreksi / Tolak Bukti Bayar</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              Berikan alasan atau catatan koreksi untuk pesanan <strong className="font-mono text-gray-900">{rejectConfirmInvoice}</strong>. Catatan ini akan ditampilkan langsung kepada tamu agar mereka dapat mengunggah bukti bayar yang benar.
            </p>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-gray-400 tracking-wider block font-semibold">Alasan Koreksi</label>
              <textarea
                rows={3}
                value={rejectReasonText}
                onChange={(e) => setRejectReasonText(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-gray-200 p-3 rounded-md focus:outline-none focus:border-[#62462b] text-xs font-light"
                placeholder="e.g. Bukti bayar terpotong atau nominal transfer tidak sesuai..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setRejectConfirmInvoice(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-xs font-semibold uppercase tracking-wider rounded hover:bg-gray-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleRejectConfirm}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold uppercase tracking-wider rounded shadow cursor-pointer"
              >
                Kirim Penolakan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM MODAL E: TAKE DOWN REVIEW CONFIRMATION */}
      {deleteReviewId && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm overflow-hidden shadow-2xl flex flex-col p-6 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-gray-900">Take Down Ulasan?</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              Apakah Anda yakin ingin men-take down (menghapus) ulasan tamu ini secara permanen dari daftar ulasan yang ditampilkan di halaman utama?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteReviewId(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-xs font-semibold uppercase tracking-wider rounded hover:bg-gray-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteReviewConfirm}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider rounded shadow cursor-pointer"
              >
                Ya, Take Down
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM MODAL C: CLEAR DATABASE ENTIRELY CONFIRMATION */}
      {clearDatabaseConfirm && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm overflow-hidden shadow-2xl flex flex-col p-6 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-gray-900">Kosongkan Database?</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              Apakah Anda yakin ingin menghapus <strong className="text-red-600 font-medium">seluruh catatan reservasi</strong> dari sistem? Tindakan ini akan membuat database menjadi kosong/bersih agar Anda dapat memulai dari nol.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setClearDatabaseConfirm(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-xs font-semibold uppercase tracking-wider rounded hover:bg-gray-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleClearAllBookings}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider rounded shadow cursor-pointer"
              >
                Ya, Kosongkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM MODAL D: RESET DEFAULT MOCK DATA CONFIRMATION */}
      {resetDatabaseConfirm && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm overflow-hidden shadow-2xl flex flex-col p-6 space-y-4">
            <div className="flex items-center space-x-3 text-[#62462b]">
              <RefreshCw className="w-6 h-6 shrink-0 animate-spin" style={{ animationDuration: '3s' }} />
              <h3 className="font-serif text-lg font-bold text-gray-900">Isi Ulang Data Contoh?</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              Apakah Anda yakin ingin mengatur ulang database dan memuat kembali data reservasi contoh (mock data) default bawaan sistem?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setResetDatabaseConfirm(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-xs font-semibold uppercase tracking-wider rounded hover:bg-gray-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleResetToDefaults}
                className="flex-1 py-2.5 bg-[#62462b] hover:bg-[#7c5d41] text-white text-xs font-semibold uppercase tracking-wider rounded shadow cursor-pointer"
              >
                Ya, Muat Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
