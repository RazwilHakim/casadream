import React from 'react';
import { ShieldCheck, CalendarRange, Clock, Sparkles, Phone, Mail, FileCheck, RefreshCw, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface PolicyViewProps {
  setView: (view: string) => void;
}

export default function PolicyView({ setView }: PolicyViewProps) {
  return (
    <div id="policy-view" className="bg-[#F3EAE0] text-[#2B1B15] font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-[#231510] text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80" 
            alt="Casa Dream Villa entrance pool" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-[#231510]/40" />
        </div>

        <div className="relative z-10 text-center max-w-3xl px-6 space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#E5D5C5] font-semibold">Resort Standard Guidelines</span>
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Cancellation & Refund Policy
          </h1>
          <div className="w-16 h-0.5 bg-[#E5D5C5] mx-auto mt-4" />
        </div>
      </section>

      {/* 2. CANCELLATION WINDOWS (3 cards) */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-[#B89F88] font-semibold">Fair & Clear Windows</span>
          <h2 className="font-serif text-2xl md:text-4xl text-gray-900 tracking-tight font-light">Understand Your Options</h2>
          <p className="text-xs text-gray-500 font-light leading-relaxed">
            We operate with clear, professional standards designed to protect both our guests reservation security and our boutique room availability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Free cancellation */}
          <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm space-y-5 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <CalendarRange className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-green-700 bg-green-100/50 px-2.5 py-0.5 rounded-full inline-block">7+ Days Notice</span>
              <h3 className="font-serif text-lg font-semibold text-gray-900">100% Full Refund</h3>
            </div>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              If your cancellation request is submitted at least 7 full days prior to your scheduled check-in, you are eligible for a 100% refund with no charges.
            </p>
          </div>

          {/* Card 2: Partial charge */}
          <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm space-y-5 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-100/50 px-2.5 py-0.5 rounded-full inline-block">2 to 7 Days Notice</span>
              <h3 className="font-serif text-lg font-semibold text-gray-900">50% Partial Refund</h3>
            </div>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Cancellations submitted between 48 hours and 7 days before check-in qualify for a 50% refund, or the option to reschedule with minor adjustments.
            </p>
          </div>

          {/* Card 3: No refund */}
          <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm space-y-5 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-100 text-red-800 text-[9px] uppercase font-bold tracking-wider px-3 py-1 rounded-bl">
              Under 48h
            </div>
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-red-700 bg-red-100/50 px-2.5 py-0.5 rounded-full inline-block">0 to 48 Hours Notice</span>
              <h3 className="font-serif text-lg font-semibold text-gray-900">Non-Refundable</h3>
            </div>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Cancellations submitted within 48 hours of the check-in time (14:00 PM local time) are non-refundable as the room was held exclusively for you.
            </p>
          </div>
        </div>
      </section>

      {/* 3. RESCHEDULING POLICY */}
      <section className="py-20 bg-white border-y border-gray-100 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Arched image left */}
          <div className="lg:col-span-5 h-[350px] md:h-[450px] rounded-t-full overflow-hidden shadow-xl bg-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80" 
              alt="Ubud Suite Canopy Bed" 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Info right */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#B89F88] font-semibold">Flexible Options</span>
              <h2 className="font-serif text-2xl md:text-4xl text-gray-900 tracking-tight leading-tight">
                Rescheduling Terms & Conditions
              </h2>
              <p className="text-xs md:text-sm text-gray-500 font-light leading-relaxed">
                We understand that travel arrangements can change. We offer flexible rescheduling policies to accommodate your needs with peace of mind.
              </p>
            </div>

            <div className="space-y-4 pt-2 text-xs md:text-sm text-gray-600 font-light leading-relaxed">
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-green-50 text-green-600 rounded-sm shrink-0 mt-0.5 border border-green-100">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-0.5">Complimentary First Reschedule</h4>
                  <p className="text-gray-500">First rescheduling requests made 5+ days before check-in are free of charge, subject to seasonal room rate differences.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1 bg-[#FAF8F5] text-[#B89F88] rounded-sm shrink-0 mt-0.5 border border-gray-100">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-0.5">Rate Adjustments</h4>
                  <p className="text-gray-500">If you move your dates from a low season to high season (holidays, long weekends), any price difference will be settled during check-in.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1 bg-[#FAF8F5] text-[#B89F88] rounded-sm shrink-0 mt-0.5 border border-gray-100">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-0.5">6-Month Validity</h4>
                  <p className="text-gray-500">Approved rescheduled bookings must select a new stay window that falls within 6 calendar months of the original check-in date.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. REFUND PROCESS */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-[#B89F88] font-semibold">Timeline</span>
          <h2 className="font-serif text-2xl md:text-4xl text-gray-900 tracking-tight font-light">The Refund Process</h2>
          <p className="text-xs text-gray-500 font-light">Step-by-step clarity of how your funds are processed and returned.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 border border-gray-100 rounded-lg shadow-sm flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white font-serif font-bold text-sm flex items-center justify-center shrink-0">1</div>
            <div className="space-y-1 text-xs text-gray-600 font-light">
              <h4 className="font-semibold text-gray-900 text-sm">Submit Refund Claim</h4>
              <p className="leading-relaxed">
                Initiate your cancellation claim by reaching out to our concierge WhatsApp or email. State your booking invoice ID (e.g., CASA-2024-xxxx) and reason for cancellation.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 rounded-lg shadow-sm flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white font-serif font-bold text-sm flex items-center justify-center shrink-0">2</div>
            <div className="space-y-1 text-xs text-gray-600 font-light">
              <h4 className="font-semibold text-gray-900 text-sm">3-5 Business Days Processing</h4>
              <p className="leading-relaxed">
                Once reviewed and approved by our finance desk, funds are transferred back to your original bank account or QRIS linkage bank within 3 to 5 business days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FORCE MAJEURE block */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-gray-100/70 border border-gray-200/50 rounded-lg p-8 md:p-12 space-y-4">
          <h3 className="font-serif text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#B89F88]" />
            <span>Force Majeure Guidelines</span>
          </h3>
          <p className="text-xs text-gray-500 font-light leading-relaxed">
            In the event of extreme acts of nature, volcanic eruptions, landslides (which occasionally affect mountain passes in West Java), government quarantine decrees, or other certified force majeure events that make travel to Puncak physically impossible, Casa Dream Villa will wave standard 48-hour terms and issue full 100% reservation credits valid for up to 12 months.
          </p>
        </div>
      </section>

      {/* 6. NEED ASSISTANCE */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#1A1A1A] text-white rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-8 md:p-16 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.3em] text-[#E5D5C5] font-semibold">Concierge Support</span>
              <h2 className="font-serif text-2xl md:text-4xl tracking-tight leading-tight">Need Assistance?</h2>
            </div>
            <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">
              If you have unique travel exceptions, medical cases, or are booking a corporate team getaway that requires custom flexible contract terms, our administrative desk is ready to help.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-4 h-4 text-[#E5D5C5]" />
                <span>stay@casadreampuncak.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-4 h-4 text-[#E5D5C5]" />
                <span>+62 811-9004-8812 (WhatsApp Concierge)</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] lg:h-full min-h-[350px] relative bg-gray-900">
            <img 
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" 
              alt="Bespoke desk service" 
              className="w-full h-full object-cover opacity-80" 
            />
          </div>
        </div>
      </section>

    </div>
  );
}
