import { Suite } from './types';

export const suitesData: Suite[] = [
  {
    id: 'casa-dream-villa',
    name: 'Casa Dream Villa',
    price: 3500000,
    description: 'Sebuah villa mewah eksklusif di Puncak yang memadukan keindahan alam dengan kenyamanan modern bintang lima.',
    longDescription: 'Casa Dream Villa adalah tempat pelarian sempurna di tengah sejuknya udara Puncak. Villa eksklusif ini dirancang dengan arsitektur modern yang dipadukan dengan sentuhan alam yang hangat, menawarkan privasi penuh dan fasilitas premium yang luar biasa. Dilengkapi dengan kolam renang pribadi, ruang hiburan biliar dan karaoke, serta area rooftop backyard yang menakjubkan untuk momen berkumpul yang tak terlupakan bersama keluarga dan kerabat.',
    image: '',
    images: ['', '', ''],
    size: '500 sqm',
    capacity: '20 Tamu',
    bedType: '4 Kamar Tidur',
    amenities: [
      'Private Swimming Pool',
      'Premium Billiard Table',
      'Premium Karaoke (Mixer)',
      'Jacuzzi Whirlpool',
      'Backyard & Grill Area (Lantai 3)',
      'Televisi 4K + Netflix & YouTube',
      'Free Wi-Fi Internet',
      'Alat Masak Lengkap',
      'Water Heater Premium',
      'Kulkas & Dispenser',
      'BBQ Grill & Alat Grill Lengkap'
    ],
    highlights: [
      {
        title: 'Private Swimming Pool',
        description: 'Nikmati kesegaran berenang di kolam renang pribadi dengan pemandangan pegunungan yang asri.',
        image: ''
      },
      {
        title: 'Premium Billiard & Karaoke',
        description: 'Fasilitas hiburan lengkap mulai dari meja biliar premium hingga sistem karaoke modern.',
        image: ''
      },
      {
        title: 'Rooftop Backyard & Grill',
        description: 'Area luar ruangan yang luas di lantai 3 untuk pesta BBQ sambil menikmati udara segar.',
        image: ''
      }
    ]
  }
];

export const facilitiesData = [
  {
    title: 'Private Infinity Pool',
    description: 'A 15-meter heated swimming pool with pristine crystal waters, framed by comfortable poolside sunbeds and misty pine forest backdrops.',
    image: ''
  },
  {
    title: 'Billiard & Entertainment Lounge',
    description: 'A premium entertainment wing equipped with a high-end Brunswick billiard table, curated liquor cabinet, large smart projector, and high-fidelity sound systems.',
    image: ''
  },
  {
    title: 'Manicured Backyard & Al Fresco Dining',
    description: 'Expansive private gardens with manicured lawns, romantic fire pit seating, and an outdoor kitchen area designed for private barbecue events under the starry sky.',
    image: ''
  }
];
