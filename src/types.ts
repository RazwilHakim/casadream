/**
 * Types and interfaces for Casa Dream Villa booking system
 */

export interface Suite {
  id: string;
  name: string;
  price: number;
  description: string;
  longDescription: string;
  image: string;
  images: string[];
  size: string; // e.g. "72 sqm"
  capacity: string; // e.g. "2 Guests"
  bedType: string; // e.g. "King Bed"
  amenities: string[];
  highlights: {
    title: string;
    description: string;
    image: string;
  }[];
}

export interface Booking {
  suiteId: string;
  suiteName: string;
  suitePrice: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  paymentMethod: 'bank_transfer' | 'qris';
  paymentReceiptName?: string;
  paymentReceiptUrl?: string;
  status: 'pending' | 'confirmed';
  invoiceNumber: string;
  totalNights: number;
  baseRateTotal: number;
  serviceCleaningFee: number;
  totalAmount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  timestamp: string;
}
