import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import SuiteDetailView from './components/SuiteDetailView';
import CheckoutView from './components/CheckoutView';
import ConfirmationView from './components/ConfirmationView';
import PolicyView from './components/PolicyView';
import FloatingChat from './components/FloatingChat';
import AdminLoginView from './components/AdminLoginView';
import AdminDashboardView from './components/AdminDashboardView';
import BookingStatusView from './components/BookingStatusView';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedSuiteId, setSelectedSuiteId] = useState<string>('casa-dream-villa');

  // Realistic default reservation dates
  const [bookingDates, setBookingDates] = useState({
    checkIn: '2026-07-10',
    checkOut: '2026-07-13',
    guests: 2
  });

  const [tempBooking, setTempBooking] = useState<any>(null);
  const [finalBooking, setFinalBooking] = useState<any>(null);

  // Read admin user session from localStorage if it exists
  const [adminUser, setAdminUser] = useState<{ username: string; role: string; fullName: string } | null>(() => {
    try {
      const stored = localStorage.getItem('casa_dream_admin');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (user: { username: string; role: string; fullName: string }) => {
    setAdminUser(user);
    localStorage.setItem('casa_dream_admin', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('casa_dream_admin');
    setCurrentView('home');
  };

  const handleSetView = (view: string, suiteId?: string) => {
    setCurrentView(view);
    if (suiteId) {
      setSelectedSuiteId(suiteId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F5] text-[#1E1B18] selection:bg-[#62462b]/20 selection:text-[#1E1B18]">
      {/* Shared Navigation Header */}
      <Header currentView={currentView} setView={handleSetView} />

      {/* Main Content Area with conditional view rendering */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <HomeView 
            setView={handleSetView} 
            bookingDates={bookingDates} 
            setBookingDates={setBookingDates} 
          />
        )}
        
        {currentView === 'suite-detail' && (
          <SuiteDetailView 
            suiteId={selectedSuiteId} 
            setView={handleSetView} 
            bookingDates={bookingDates} 
            setBookingDates={setBookingDates} 
            setTempBooking={setTempBooking}
          />
        )}
        
        {currentView === 'checkout' && (
          <CheckoutView 
            tempBooking={tempBooking} 
            setView={handleSetView} 
            setFinalBooking={setFinalBooking} 
          />
        )}
        
        {currentView === 'confirmation' && (
          <ConfirmationView 
            finalBooking={finalBooking} 
            setView={handleSetView} 
          />
        )}
        
        {currentView === 'policy' && (
          <PolicyView 
            setView={handleSetView} 
          />
        )}

        {currentView === 'booking-status' && (
          <BookingStatusView 
            setView={handleSetView} 
            initialInvoiceId={finalBooking?.invoiceNumber || ''}
          />
        )}

        {currentView === 'admin-login' && (
          <AdminLoginView 
            setView={handleSetView} 
            onLoginSuccess={handleLoginSuccess} 
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboardView 
            setView={handleSetView} 
            adminUser={adminUser} 
            onLogout={handleLogout} 
          />
        )}
      </main>

      {/* Floating Concierge Chat Agent */}
      <FloatingChat />

      {/* Shared Footer block */}
      <Footer setView={handleSetView} />
    </div>
  );
}
