import React, { useState } from 'react';
import { Lock, User, ShieldAlert, Sparkles, Key, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminLoginViewProps {
  setView: (view: string) => void;
  onLoginSuccess: (user: { username: string; role: string; fullName: string }) => void;
}

export default function AdminLoginView({ setView, onLoginSuccess }: AdminLoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Specific admin credentials requested by the user
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const inputUsername = username.trim().toLowerCase();
      
      if (inputUsername === 'casadreamvilla' && password === 'Casadrea25') {
        onLoginSuccess({
          username: 'casadreamvilla',
          role: 'Super Admin',
          fullName: 'Casa Dream Executive Concierge'
        });
        setView('admin-dashboard');
      } else {
        setError('Kombinasi Username atau Password salah. Silakan periksa kembali kredensial Anda.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div id="admin-login-view" className="bg-[#FFF8F5] text-[#1E1B18] py-20 px-6 md:px-12 min-h-[85vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl border border-[#D3C4B9]/30 shadow-xl space-y-6">
        <div className="space-y-2 text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#62462b] font-bold flex items-center justify-center space-x-1.5">
            <Key className="w-3.5 h-3.5" />
            <span>CASA DREAM SECURE GATEWAY</span>
          </span>
          <h1 className="font-serif text-3xl tracking-tight text-gray-900 font-semibold">Concierge Portal</h1>
          <p className="text-xs text-gray-500 font-light">Masuk menggunakan kredensial resmi untuk mengelola pesanan, melacak pembayaran, dan melayani tamu sanctuary.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 text-xs text-red-600">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">Username</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                placeholder="Masukkan username admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-gray-200 text-xs py-3.5 pl-10 pr-4 rounded-md focus:outline-none focus:border-[#62462b] transition-colors"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Password</label>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-gray-200 text-xs py-3.5 pl-10 pr-10 rounded-md focus:outline-none focus:border-[#62462b] transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#62462b] hover:bg-[#7c5d41] disabled:bg-gray-400 text-white font-semibold text-xs tracking-[0.25em] uppercase transition-all duration-300 rounded-md shadow-lg flex items-center justify-center space-x-2 mt-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>MENGOTENTIKASI...</span>
              </>
            ) : (
              <span>MASUK KE DASHBOARD</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setView('home')}
            className="text-[10px] text-gray-400 hover:text-[#62462b] uppercase tracking-wider font-semibold transition-colors cursor-pointer"
          >
            ← Kembali ke Beranda Tamu
          </button>
          <div className="flex items-center justify-center space-x-1.5 text-[10px] text-gray-300 font-light">
            <span>🔒 Secure SSL Gateway</span>
            <span>•</span>
            <span>Casa Dream Resort</span>
          </div>
        </div>
      </div>
    </div>
  );
}
