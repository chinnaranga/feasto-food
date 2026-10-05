import React, { useState } from 'react';
import { useAdminStore } from '../../store/admin/adminStore';
import { SmartTable, TableColumn } from '../../components/admin/SmartTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { AdminCampaign } from '../../types/admin';
import { Button } from '@/components/ui/Button';
import { DashboardCard } from '../../components/admin/DashboardCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Send } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

export const Marketing: React.FC = () => {
  const { campaigns, addCampaign, endCampaign } = useAdminStore();
  const { addToast } = useToastStore();

  // Campaign Form State
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('20');
  const [campaignType, setCampaignType] = useState<AdminCampaign['type']>('coupon');

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') {
      addToast({ message: 'Campaign title is required.', type: 'error' });
      return;
    }

    addCampaign({
      title,
      code: campaignType === 'coupon' ? code.toUpperCase() : undefined,
      discountPercent: campaignType === 'coupon' ? Number(discountPercent) : undefined,
      type: campaignType,
      status: 'active',
    });

    addToast({ message: `Successfully launched campaign: ${title}`, type: 'success' });
    setTitle('');
    setCode('');
  };

  const columns: TableColumn<AdminCampaign>[] = [
    {
      key: 'title',
      label: 'Campaign Title',
      sortable: true,
      render: (item) => (
        <div className="text-left font-bold text-text-primary">
          {item.title}
        </div>
      ),
    },
    {
      key: 'code',
      label: 'Promo Code',
      render: (item) =>
        item.code ? (
          <code className="px-2 py-1 bg-surface-bg border border-border-main rounded text-xs font-mono font-bold text-brand-orange">
            {item.code}
          </code>
        ) : (
          <span className="text-text-muted text-[10px]">None (Auto-applied)</span>
        ),
    },
    {
      key: 'type',
      label: 'Campaign Type',
      sortable: true,
      render: (item) => {
        const getStyle = () => {
          if (item.type === 'coupon') return 'bg-orange-500/5 text-orange-600 border-orange-500/20';
          if (item.type === 'push_campaign') return 'bg-blue-500/5 text-blue-600 border-blue-500/20';
          if (item.type === 'featured_restaurant') return 'bg-purple-500/5 text-purple-600 border-purple-500/20';
          return 'bg-teal-500/5 text-teal-600 border-teal-500/20';
        };
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-lg border text-[10px] font-bold capitalize ${getStyle()}`}>
            {item.type.replace('_', ' ')}
          </span>
        );
      },
    },
    {
      key: 'reach',
      label: 'Reach Est.',
      sortable: true,
      render: (item) => <span className="font-mono">{item.reach.toLocaleString()} views</span>,
    },
    {
      key: 'redemptions',
      label: 'Conversions',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-success-main font-bold">
          {item.redemptions.toLocaleString()} clicks
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Campaign Status',
      sortable: true,
      render: (item) => <StatusBadge value={item.status} />,
    },
    {
      key: 'actions',
      label: 'Operations',
      render: (item) => (
        item.status === 'active' ? (
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              endCampaign(item.id);
              addToast({ message: 'Campaign deactivated.', type: 'info' });
            }}
            className="h-7 text-[10px] font-bold py-1 px-2.5 rounded-lg"
          >
            End Campaign
          </Button>
        ) : (
          <span className="text-[10px] text-text-muted font-bold">Ended</span>
        )
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div className="text-left">
          <h2 className="text-lg font-extrabold text-text-primary tracking-tight font-heading">
            Marketing Campaign Console
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Build promotional discount codes, manage loyalty points campaigns, and schedule push message campaigns.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Campaign Creator Widget (4 Columns) */}
        <div className="lg:col-span-4">
          <DashboardCard
            title="Create Campaign"
            description="Launch a new promotional offer, push notification broadcast, or featured restaurant slot."
          >
            <form onSubmit={handleLaunch} className="space-y-4">
              <Select
                label="Campaign Target Type"
                value={campaignType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCampaignType(e.target.value as AdminCampaign['type'])}
                options={[
                  { value: 'coupon', label: 'Promo Coupon Code' },
                  { value: 'push_campaign', label: 'Push Message Alert' },
                  { value: 'featured_restaurant', label: 'Featured Boost Slot' },
                  { value: 'loyalty_promotion', label: 'Double Points Loyalty' },
                ]}
              />

              <Input
                label="Campaign Title"
                placeholder="e.g. 20% Off Lunch Platter Special"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              />

              {campaignType === 'coupon' && (
                <div className="grid grid-cols-2 gap-3 animate-fade-in">
                  <Input
                    label="Promo Code"
                    placeholder="e.g. FEAST20"
                    value={code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
                  />
                  <Select
                    label="Discount %"
                    value={discountPercent}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDiscountPercent(e.target.value)}
                    options={[
                      { value: '10', label: '10%' },
                      { value: '20', label: '20%' },
                      { value: '30', label: '30%' },
                      { value: '50', label: '50%' },
                    ]}
                  />
                </div>
              )}

              <Button type="submit" variant="primary" className="w-full text-xs font-bold py-2.5">
                <Send size={13} /> Launch Active Campaign
              </Button>
            </form>
          </DashboardCard>
        </div>

        {/* Right Column: Campaigns Grid (8 Columns) */}
        <div className="lg:col-span-8">
          <SmartTable
            data={campaigns}
            columns={columns}
            searchPlaceholder="Search active marketing codes..."
            searchFields={['title', 'code']}
            filterField="type"
            filterOptions={[
              { value: 'coupon', label: 'Promo Coupons' },
              { value: 'push_campaign', label: 'Push Alerts' },
              { value: 'featured_restaurant', label: 'Featured Boosts' },
              { value: 'loyalty_promotion', label: 'Loyalty Tiers' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
