import React from 'react';
import { History, Star, MapPin, Clock, ArrowRight } from 'lucide-react';
import {
  FeastoSectionHeader,
  FeastoDataTable,
  FeastoColumn,
} from '@/components/design-system';

interface HistoryTrip {
  id: string;
  orderNumber: string;
  date: string;
  restaurant: string;
  destination: string;
  distanceKm: number;
  earnings: number;
  rating: number;
}

export const RiderHistoryPage: React.FC = () => {
  const historyData: HistoryTrip[] = [
    {
      id: 'h-1',
      orderNumber: '#1814',
      date: 'Today · 16:15',
      restaurant: 'Spice Route Kitchen',
      destination: 'Perry Cross Road, Bandra',
      distanceKm: 2.8,
      earnings: 145,
      rating: 5.0,
    },
    {
      id: 'h-2',
      orderNumber: '#1809',
      date: 'Today · 15:42',
      restaurant: 'La Pasta Bella',
      destination: '14th Road, Khar West',
      distanceKm: 3.2,
      earnings: 120,
      rating: 5.0,
    },
    {
      id: 'h-3',
      orderNumber: '#1805',
      date: 'Today · 14:10',
      restaurant: 'Sora Japanese Dining',
      destination: 'Carter Road Promenade',
      distanceKm: 4.1,
      earnings: 185,
      rating: 4.9,
    },
    {
      id: 'h-4',
      orderNumber: '#1798',
      date: 'Yesterday · 21:30',
      restaurant: 'Artisan Table Bistro',
      destination: 'BKC Central Avenue',
      distanceKm: 5.6,
      earnings: 240,
      rating: 5.0,
    },
    {
      id: 'h-5',
      orderNumber: '#1791',
      date: 'Yesterday · 20:15',
      restaurant: 'Dum Pukht Heritage',
      destination: 'Hill Road Junction',
      distanceKm: 2.1,
      earnings: 110,
      rating: 5.0,
    },
  ];

  const columns: FeastoColumn<HistoryTrip>[] = [
    {
      key: 'order',
      header: 'TRIP ID',
      render: (item) => (
        <span className="font-mono font-bold text-white">{item.orderNumber}</span>
      ),
    },
    {
      key: 'date',
      header: 'TIMESTAMP',
      render: (item) => <span className="font-mono text-[#8E929C]">{item.date}</span>,
    },
    {
      key: 'restaurant',
      header: 'RESTAURANT (PICKUP)',
      render: (item) => (
        <strong className="font-heading font-bold text-white block">{item.restaurant}</strong>
      ),
    },
    {
      key: 'destination',
      header: 'DESTINATION (DROP-OFF)',
      render: (item) => <span className="text-[#8E929C]">{item.destination}</span>,
    },
    {
      key: 'distance',
      header: 'DISTANCE',
      align: 'right',
      render: (item) => <span className="font-mono text-white">{item.distanceKm} km</span>,
    },
    {
      key: 'earnings',
      header: 'PAYOUT',
      align: 'right',
      render: (item) => (
        <span className="font-mono font-black text-[#D7F04A] text-sm">₹{item.earnings}</span>
      ),
    },
    {
      key: 'rating',
      header: 'RATING',
      align: 'right',
      render: (item) => (
        <span className="font-mono font-bold text-amber-400">★ {item.rating.toFixed(1)}</span>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6 text-left select-none text-[#F3F0E8]">
      <FeastoSectionHeader
        index="04"
        title="DELIVERY ARCHIVE"
        subtitle="Chronological log of verified courier dispatches, distances navigated, and trip settlements."
        dark
      />

      <FeastoDataTable
        columns={columns}
        data={historyData}
        keyExtractor={(item) => item.id}
        dark
      />
    </div>
  );
};

export default RiderHistoryPage;
