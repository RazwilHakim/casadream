import React from 'react';
import { motion } from 'motion/react';

export default function FloatingChat() {
  return (
    <motion.a
      href="https://wa.me/6287819346362"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[100] w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-[#075e54] via-[#128C7E] to-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(37,211,102,0.4)] border border-white/20 hover:shadow-[0_12px_40px_rgba(37,211,102,0.55)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      aria-label="Hubungi kami via WhatsApp"
    >
      {/* Premium Minimalist & Elegant WhatsApp SVG Logo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
      >
        <defs>
          <mask id="whatsapp-mask">
            {/* The white area keeps the underlying shape visible */}
            <rect width="24" height="24" fill="#FFFFFF" />
            {/* The black area cuts out the telephone handset, revealing the gradient background */}
            <path
              fill="#000000"
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347Z"
            />
          </mask>
        </defs>

        {/* Perfectly Circular Speech Bubble with custom sleek geometric tail */}
        <g mask="url(#whatsapp-mask)">
          <circle cx="12" cy="11.5" r="8.5" fill="#FFFFFF" />
          <polygon points="5.5,17 3,21.5 8,19.8" fill="#FFFFFF" />
        </g>
      </svg>
      
      {/* Ripple Animation Effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping -z-10" />
 
      {/* Hover Tooltip */}
      <div className="absolute right-20 bg-white border border-gray-100 px-3.5 py-2 rounded-xl shadow-xl text-xs text-gray-800 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none hidden sm:block">
        Tanya Kami di WhatsApp
      </div>
    </motion.a>
  );
}
