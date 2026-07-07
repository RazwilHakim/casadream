import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, ArrowUp, Send, Check } from 'lucide-react';

interface FooterProps {
  setView: (view: string, suiteId?: string) => void;
}

export default function Footer({ setView }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleNavClick = (viewId: string) => {
    setView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="app-footer" className="bg-[#F5ECE7] border-t border-[#D3C4B9]/50 text-[#4F453D] pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex flex-col cursor-pointer" onClick={() => handleNavClick('home')}>
            <span className="font-serif text-xl md:text-2xl tracking-[0.25em] text-[#62462b] font-light">
              CASA DREAM
            </span>
            <span className="text-[9px] tracking-[0.45em] text-[#81756c] -mt-1 pl-0.5">
              VILLA SANCTUARY
            </span>
          </div>
          <p className="text-xs leading-relaxed text-[#81756c] font-light pr-4">
            A quiet luxury retreat nestled in the crisp, pristine hills of Puncak, Indonesia. Designed for deep rejuvenation, absolute privacy, and discerning tastes.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white hover:bg-[#62462b]/10 hover:text-[#62462b] text-[#62462b] transition-all rounded-sm border border-[#D3C4B9]">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white hover:bg-[#62462b]/10 hover:text-[#62462b] text-[#62462b] transition-all rounded-sm border border-[#D3C4B9]">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Info & Policy Column */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-[0.2em] text-[#62462b] font-semibold">
            Information
          </h4>
          <ul className="space-y-2.5 text-xs font-light">
            <li>
              <button onClick={() => handleNavClick('policy')} className="hover:text-[#62462b] transition-colors text-left">
                Cancellation & Refund Policy
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('policy')} className="hover:text-[#62462b] transition-colors text-left">
                Rescheduling Terms
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('admin-login')} className="hover:text-[#62462b] text-[#62462b] font-medium transition-colors text-left flex items-center space-x-1">
                <span>🔑 Portal Admin Concierge</span>
              </button>
            </li>
            <li className="flex items-start space-x-2 text-[#81756c] mt-4">
              <MapPin className="w-4 h-4 text-[#62462b] shrink-0 mt-0.5" />
              <span className="leading-relaxed">Jl. Raya Puncak Gadog No.88, Tugu Utara, Kec. Cisarua, Kabupaten Bogor, Jawa Barat 16750</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-[0.2em] text-[#62462b] font-semibold">
            Concierge Club
          </h4>
          <p className="text-xs text-[#81756c] font-light leading-relaxed">
            Join our private circle to receive seasonal updates, priority room booking windows, and curated local guide books.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-white border border-[#D3C4B9] text-[#1E1B18] placeholder-gray-400 px-4 py-3 text-xs rounded-sm focus:outline-none focus:border-[#62462b] transition-colors pr-10"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#62462b] hover:text-[#7c5d41] transition-colors"
                aria-label="Subscribe"
              >
                {subscribed ? <Check className="w-4 h-4 text-green-600" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            {subscribed && (
              <span className="text-[10px] text-green-600 font-light">
                Successfully subscribed to our digital journal. Welcome.
              </span>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-[#D3C4B9]/40 flex flex-col md:flex-row items-center justify-between text-xs text-[#81756c] font-light">
        <p>© 2026 Casa Dream Villa. All rights private and protected. Developed under Puncak Sanctuary Group.</p>
        <button 
          onClick={scrollToTop} 
          className="mt-4 md:mt-0 flex items-center space-x-2 hover:text-[#62462b] transition-colors py-1 px-3 bg-white rounded-sm border border-[#D3C4B9]"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}
