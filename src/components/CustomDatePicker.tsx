import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDisplayDate } from '../utils';

interface CustomDatePickerProps {
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  onChange: (dates: { checkIn: string; checkOut: string }) => void;
}

export default function CustomDatePicker({ checkIn, checkOut, onChange }: CustomDatePickerProps) {
  const [activePopover, setActivePopover] = useState<'checkIn' | 'checkOut' | null>(null);
  
  const checkInRef = useRef<HTMLDivElement>(null);
  const checkOutRef = useRef<HTMLDivElement>(null);

  // Close calendar popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedInsideCheckIn = checkInRef.current?.contains(target);
      const clickedInsideCheckOut = checkOutRef.current?.contains(target);
      
      if (!clickedInsideCheckIn && !clickedInsideCheckOut) {
        setActivePopover(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getMinCheckOutDate = () => {
    if (!checkIn) return today;
    const checkInDate = new Date(checkIn);
    const nextDay = new Date(checkInDate);
    nextDay.setDate(checkInDate.getDate() + 1);
    return nextDay;
  };

  const handleSelectCheckIn = (dateStr: string) => {
    const clickedDate = new Date(dateStr);
    const checkOutDate = checkOut ? new Date(checkOut) : null;

    let nextCheckOut = checkOut;
    
    // If checkout doesn't exist, or is before or equal to new check-in date
    if (!checkOutDate || checkOutDate <= clickedDate) {
      const nextDay = new Date(clickedDate);
      nextDay.setDate(clickedDate.getDate() + 1);
      nextCheckOut = nextDay.toISOString().split('T')[0];
    }

    onChange({
      checkIn: dateStr,
      checkOut: nextCheckOut
    });
    
    // Smooth transition to check-out selection
    setTimeout(() => {
      setActivePopover('checkOut');
    }, 150);
  };

  const handleSelectCheckOut = (dateStr: string) => {
    onChange({
      checkIn,
      checkOut: dateStr
    });
    setActivePopover(null);
  };

  return (
    <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
      
      {/* 1. CHECK-IN TRIGGER COLUMN */}
      <div ref={checkInRef} className="relative group">
        <label className="text-[10px] uppercase tracking-[0.2em] text-[#B89F88] font-semibold flex items-center space-x-1.5 mb-2">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Check-In Date</span>
        </label>
        
        <button
          type="button"
          onClick={() => setActivePopover(activePopover === 'checkIn' ? null : 'checkIn')}
          className={`flex items-center justify-between w-full bg-[#FDFBF7] hover:bg-[#F5F1EB] border rounded-lg py-3 px-4 transition-all duration-300 min-h-[50px] shadow-sm text-left focus:outline-none ${
            activePopover === 'checkIn' ? 'border-[#B89F88] ring-2 ring-[#B89F88]/10' : 'border-[#E5D5C5]/50'
          }`}
        >
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-gray-900 leading-tight">
              {checkIn ? formatDisplayDate(checkIn) : 'Pilih Tanggal'}
            </span>
            <span className="text-[9px] text-gray-400 font-light mt-0.5">Mulai Menginap</span>
          </div>
          <CalendarIcon className="w-4 h-4 text-[#B89F88] opacity-70 group-hover:opacity-100 transition-opacity" />
        </button>

        <AnimatePresence>
          {activePopover === 'checkIn' && (
            <CalendarPopover
              type="checkIn"
              selectedDate={checkIn}
              onSelect={handleSelectCheckIn}
              minDate={today}
              checkIn={checkIn}
              checkOut={checkOut}
              onClose={() => setActivePopover(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* 2. CHECK-OUT TRIGGER COLUMN */}
      <div ref={checkOutRef} className="relative group">
        <label className="text-[10px] uppercase tracking-[0.2em] text-[#B89F88] font-semibold flex items-center space-x-1.5 mb-2">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Check-Out Date</span>
        </label>
        
        <button
          type="button"
          onClick={() => setActivePopover(activePopover === 'checkOut' ? null : 'checkOut')}
          className={`flex items-center justify-between w-full bg-[#FDFBF7] hover:bg-[#F5F1EB] border rounded-lg py-3 px-4 transition-all duration-300 min-h-[50px] shadow-sm text-left focus:outline-none ${
            activePopover === 'checkOut' ? 'border-[#B89F88] ring-2 ring-[#B89F88]/10' : 'border-[#E5D5C5]/50'
          }`}
        >
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-gray-900 leading-tight">
              {checkOut ? formatDisplayDate(checkOut) : 'Pilih Tanggal'}
            </span>
            <span className="text-[9px] text-gray-400 font-light mt-0.5">Selesai Menginap</span>
          </div>
          <CalendarIcon className="w-4 h-4 text-[#B89F88] opacity-70 group-hover:opacity-100 transition-opacity" />
        </button>

        <AnimatePresence>
          {activePopover === 'checkOut' && (
            <CalendarPopover
              type="checkOut"
              selectedDate={checkOut}
              onSelect={handleSelectCheckOut}
              minDate={getMinCheckOutDate()}
              checkIn={checkIn}
              checkOut={checkOut}
              onClose={() => setActivePopover(null)}
            />
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

/* ==========================================
   COMPACT CALENDAR POPOVER SUB-COMPONENT
   ========================================== */
interface CalendarPopoverSubProps {
  type: 'checkIn' | 'checkOut';
  selectedDate: string;
  onSelect: (dateStr: string) => void;
  minDate: Date;
  checkIn: string;
  checkOut: string;
  onClose: () => void;
}

function CalendarPopover({
  type,
  selectedDate,
  onSelect,
  minDate,
  checkIn,
  checkOut,
  onClose
}: CalendarPopoverSubProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return selectedDate ? new Date(selectedDate) : new Date();
  });
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndexRaw = new Date(year, month, 1).getDay();
  const firstDayIndex = firstDayIndexRaw === 0 ? 6 : firstDayIndexRaw - 1; // Mon-Sun standard

  const prevMonthDays = () => {
    const prev = [];
    const prevMonthDaysCount = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      prev.push(prevMonthDaysCount - i);
    }
    return prev;
  };

  const currentMonthDays = () => {
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getDateString = (day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const isSelected = (dayStr: string) => dayStr === selectedDate;
  const isCheckIn = (dayStr: string) => dayStr === checkIn;
  const isCheckOut = (dayStr: string) => dayStr === checkOut;

  const isInRange = (dayStr: string) => {
    if (!checkIn || !checkOut) return false;
    const date = new Date(dayStr);
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return date > start && date < end;
  };

  const isHoverHighlight = (dayStr: string) => {
    if (type !== 'checkOut' || !checkIn || !hoveredDate) return false;
    const date = new Date(dayStr);
    const start = new Date(checkIn);
    const hover = new Date(hoveredDate);
    return date > start && date <= hover;
  };

  const isPast = (dayStr: string) => {
    const date = new Date(dayStr);
    return date < minDate;
  };

  const getDayLabel = (dayStr: string) => {
    const d = new Date(dayStr);
    const day = d.getDay();
    if (day === 5) return 'Jumat: Rp 3.8jt';
    if (day === 6 || day === 0) return 'Weekend: Rp 5.0jt';
    return 'Weekdays: Rp 3.5jt';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute top-[calc(100%+6px)] left-0 w-[310px] bg-white rounded-xl shadow-2xl border border-[#E5D5C5]/45 p-4 z-50 space-y-3.5"
    >
      {/* Month selection controller */}
      <div className="flex items-center justify-between border-b border-gray-50 pb-2">
        <button
          type="button"
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          className="p-1 rounded-full hover:bg-[#FAF8F5] text-gray-500 hover:text-gray-900 transition-all border border-gray-100"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="font-serif text-xs font-bold text-gray-900 uppercase tracking-widest">
          {monthNames[month]} {year}
        </span>
        <button
          type="button"
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          className="p-1 rounded-full hover:bg-[#FAF8F5] text-gray-500 hover:text-gray-900 transition-all border border-gray-100"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Weekdays indicator */}
      <div className="grid grid-cols-7 text-center text-[9px] text-gray-400 font-bold uppercase tracking-wider py-1 bg-gray-50/70 rounded border border-gray-100/50">
        <span>S</span>
        <span>S</span>
        <span>R</span>
        <span>K</span>
        <span>J</span>
        <span className="text-amber-600/80">S</span>
        <span className="text-amber-600/80">M</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-1 gap-x-0.5">
        {/* Previous Month Offset */}
        {prevMonthDays().map((day, idx) => (
          <div key={`p-${idx}`} className="h-8 flex items-center justify-center text-[10px] text-gray-300 font-light select-none">
            {day}
          </div>
        ))}

        {/* Current Month Days */}
        {currentMonthDays().map((day) => {
          const dayStr = getDateString(day);
          const isSelectedDay = isSelected(dayStr);
          const isCheckInDay = isCheckIn(dayStr);
          const isCheckOutDay = isCheckOut(dayStr);
          const inRangeDay = isInRange(dayStr);
          const isHoveredRange = isHoverHighlight(dayStr);
          const past = isPast(dayStr);

          // Customize typography colors
          const dObj = new Date(dayStr);
          const isFri = dObj.getDay() === 5;
          const isWeekend = dObj.getDay() === 6 || dObj.getDay() === 0;

          let textClass = 'text-gray-800';
          if (past) textClass = 'text-gray-300 cursor-not-allowed';
          else if (isSelectedDay) textClass = 'text-white font-bold';
          else if (isFri) textClass = 'text-blue-600 font-medium';
          else if (isWeekend) textClass = 'text-amber-600 font-medium';

          return (
            <button
              key={dayStr}
              type="button"
              disabled={past}
              onClick={() => onSelect(dayStr)}
              onMouseEnter={() => !past && setHoveredDate(dayStr)}
              onMouseLeave={() => setHoveredDate(null)}
              className={`h-8 relative flex flex-col items-center justify-center text-[11px] rounded transition-all group/day ${
                past ? 'pointer-events-none' : 'cursor-pointer'
              } ${
                isCheckInDay 
                  ? 'bg-[#1A1A1A] text-white rounded-r-none' 
                  : isCheckOutDay 
                  ? 'bg-[#B89F88] text-white rounded-l-none'
                  : inRangeDay 
                  ? 'bg-[#F5F1EB] text-[#1A1A1A] rounded-none'
                  : isHoveredRange 
                  ? 'bg-[#F5F1EB]/85 text-[#1A1A1A] rounded-none border-y border-dashed border-[#B89F88]/30'
                  : 'hover:bg-[#FAF8F5]'
              }`}
            >
              <span className={`z-10 text-[10.5px] font-semibold ${textClass}`}>{day}</span>

              {/* Hover pricing banner */}
              {!past && !isSelectedDay && !inRangeDay && (
                <div className="absolute bottom-9 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-[8px] py-0.5 px-1.5 rounded opacity-0 group-hover/day:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 shadow-lg font-light">
                  {getDayLabel(dayStr)}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Info note */}
      <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-gray-100 text-[9px] text-gray-500 flex items-start space-x-1.5">
        <Info className="w-3.5 h-3.5 text-[#B89F88] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-gray-800">Tarif per Malam:</span>
          <p>Sen-Kam: Rp 3.5jt | Jum: Rp 3.8jt | Sab-Min: Rp 5jt</p>
        </div>
      </div>


    </motion.div>
  );
}
