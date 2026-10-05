import React from 'react';
import { Download, FileText } from 'lucide-react';
import { RiderButton, RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderEarningsStatementsPage: React.FC = () => {
  const statements = [
    { month: 'July 2026', total: '₹48,900.00', status: 'Available' },
    { month: 'June 2026', total: '₹52,400.00', status: 'Available' },
    { month: 'May 2026', total: '₹46,150.00', status: 'Available' },
  ];

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Downloadable Tax & Financial Statements" subtitle="Monthly PDF statements for banking, loan proof, and tax returns." />

      <div className="space-y-3">
        {statements.map((s, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-neutral-100 text-neutral-600">
                <FileText size={18} />
              </div>
              <div>
                <strong className="font-bold text-neutral-900 block">{s.month} Statement</strong>
                <span className="font-mono text-neutral-500">Total Payout: {s.total}</span>
              </div>
            </div>

            <RiderButton variant="outline" size="sm">
              <Download size={14} className="mr-1" /> PDF
            </RiderButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiderEarningsStatementsPage;
