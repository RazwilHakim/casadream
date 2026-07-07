/**
 * Utility functions for currency formatting and dynamic booking price calculations.
 */

/**
 * Formats a number to Indonesian Rupiah (Rp) currency format.
 * Example: 3500000 -> Rp 3.500.000
 */
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value).replace(/Rp/g, 'Rp ');
}

export interface DayPriceDetail {
  date: string;
  dayName: string;
  rate: number;
  label: string;
}

export interface BookingPriceSummary {
  nights: number;
  baseRateTotal: number;
  serviceCleaningFee: number;
  totalAmount: number;
  details: DayPriceDetail[];
}

/**
 * Calculates the total booking price based on check-in and check-out dates.
 * Rates:
 * - Weekdays (Senin, Selasa, Rabu, Kamis): Rp 3.500.000
 * - Jumat: Rp 3.800.000
 * - Weekend (Sabtu, Minggu): Rp 5.000.000
 */
export function calculateBookingPrice(checkInStr: string, checkOutStr: string): BookingPriceSummary {
  const serviceCleaningFee = 250000; // Rp 250.000 flat cleaning fee for premium luxury inclusions

  if (!checkInStr || !checkOutStr) {
    return {
      nights: 0,
      baseRateTotal: 0,
      serviceCleaningFee,
      totalAmount: 0,
      details: []
    };
  }

  const d1 = new Date(checkInStr);
  const d2 = new Date(checkOutStr);

  let total = 0;
  let nights = 0;
  const details: DayPriceDetail[] = [];

  const current = new Date(d1);
  while (current < d2) {
    const day = current.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
    let rate = 3500000; // Weekday default
    let label = 'Weekdays';

    if (day === 5) {
      rate = 3800000;
      label = 'Jumat';
    } else if (day === 6 || day === 0) {
      rate = 5000000;
      label = 'Weekend';
    }

    total += rate;
    nights++;

    details.push({
      date: current.toISOString().split('T')[0],
      dayName: current.toLocaleDateString('id-ID', { weekday: 'long' }),
      rate,
      label
    });

    current.setDate(current.getDate() + 1);
  }

  // Fallback if dates are identical or invalid
  if (nights === 0) {
    nights = 1;
    total = 3500000;
    details.push({
      date: checkInStr,
      dayName: d1.toLocaleDateString('id-ID', { weekday: 'long' }),
      rate: 3500000,
      label: 'Weekdays'
    });
  }

  return {
    nights,
    baseRateTotal: total,
    serviceCleaningFee,
    totalAmount: total + serviceCleaningFee,
    details
  };
}

/**
 * Formats a date string into a beautiful Indonesian display format.
 * Example: "2026-07-06" -> "Senin, 06 Jul 2026"
 */
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return 'Pilih Tanggal';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

