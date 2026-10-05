import React from 'react';
import { PageContainer } from './components/layout/PageContainer';
import { PortalPageHeader } from './components/common/PortalPageHeader';
import { Card } from './components/ui/Card';
import { Badge } from './components/ui/Badge';
import { Button } from './components/ui/Button';
import { PortalEmptyState } from './components/common/PortalEmptyState';
import { usePortalStore } from './store/portalStore';
import { usePortalAuthStore } from './store/portalAuthStore';
import './styles/theme.css';

// ─── Dashboard View Placeholder ──────────────────────────────────────────────
export const PortalDashboardView: React.FC = () => {
  const { selectedRestaurant } = usePortalStore();
  const { user } = usePortalAuthStore();

  return (
    <PageContainer>
      <PortalPageHeader
        title={`Welcome back, ${user?.displayName || 'Merchant'}`}
        description={`Operations overview for ${selectedRestaurant?.name || 'your store'}.`}
        actions={
          <Button variant="primary">
            Export Report
          </Button>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left mb-8">
        <Card>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Live Active Orders</span>
          <span className="text-2xl font-black text-neutral-800 leading-none">12 Orders</span>
          <p className="text-[10px] text-emerald-600 mt-2 font-semibold">↑ 4 new in last 10m</p>
        </Card>

        <Card>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Today's Net Revenue</span>
          <span className="text-2xl font-black text-neutral-800 leading-none">₹24,850</span>
          <p className="text-[10px] text-emerald-600 mt-2 font-semibold">↑ 8.2% vs yesterday</p>
        </Card>

        <Card>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Kitchen Ticket Speed</span>
          <span className="text-2xl font-black text-neutral-800 leading-none">14.2m</span>
          <p className="text-[10px] text-neutral-400 mt-2 font-semibold">Optimal status</p>
        </Card>
      </div>

      <Card className="text-left">
        <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider mb-4">Operational Status Alerts</h3>
        <div className="space-y-3.5 divide-y divide-neutral-100">
          <div className="flex items-center justify-between py-2 text-xs">
            <span className="font-semibold text-neutral-700">Kitchen Display Terminal #1 (KDT-1)</span>
            <Badge variant="success">Online</Badge>
          </div>
          <div className="flex items-center justify-between pt-3.5 text-xs">
            <span className="font-semibold text-neutral-700">POS Integration Sync</span>
            <Badge variant="success">Synchronized</Badge>
          </div>
          <div className="flex items-center justify-between pt-3.5 text-xs">
            <span className="font-semibold text-neutral-700">Orders Dispatch SLA Alerts</span>
            <Badge variant="secondary">0 Alerts Active</Badge>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

// ─── Orders View Placeholder ─────────────────────────────────────────────────
export const PortalOrdersView: React.FC = () => {
  return (
    <PageContainer>
      <PortalPageHeader
        title="Live Orders Hub"
        description="Monitor, update, and manage incoming operations tickets."
      />
      <PortalEmptyState
        title="No active incoming orders"
        description="We will notify you here once customers place order tickets for this branch location."
      />
    </PageContainer>
  );
};

// ─── Menu View Placeholder ───────────────────────────────────────────────────
export const PortalMenuView: React.FC = () => {
  return (
    <PageContainer>
      <PortalPageHeader
        title="Menu & Catalog Manager"
        description="Expose menu categories, set prices, and configure dietary tags."
      />
      <PortalEmptyState
        title="Menu catalog is empty"
        description="Contact support or connect your POS terminal to import restaurant categories."
      />
    </PageContainer>
  );
};

// ─── Inventory View Placeholder ───────────────────────────────────────────────
export const PortalInventoryView: React.FC = () => {
  return (
    <PageContainer>
      <PortalPageHeader
        title="Stock & Inventory Desk"
        description="Track active ingredients volumes and trigger warnings when low."
      />
      <PortalEmptyState
        title="Inventory logs empty"
        description="Set up items alerts rules to prevent order cancellation incidents."
      />
    </PageContainer>
  );
};

// ─── Staff View Placeholder ──────────────────────────────────────────────────
export const PortalStaffView: React.FC = () => {
  return (
    <PageContainer>
      <PortalPageHeader
        title="Staff & Shift Permissions"
        description="Assign dashboard roles and check active shift checklists."
      />
      <PortalEmptyState
        title="No staff members listed"
        description="Invite restaurant managers, cashiers, and kitchen team members to coordinate operations."
      />
    </PageContainer>
  );
};

// ─── Analytics View Placeholder ──────────────────────────────────────────────
export const PortalAnalyticsView: React.FC = () => {
  return (
    <PageContainer>
      <PortalPageHeader
        title="Operations Analytics Desk"
        description="Study sales distribution parameters and dispatch latency reports."
      />
      <PortalEmptyState
        title="No analytics charts built"
        description="Analytics data sets populate once the portal handles transaction volume."
      />
    </PageContainer>
  );
};

// ─── Promotions View Placeholder ─────────────────────────────────────────────
export const PortalPromotionsView: React.FC = () => {
  return (
    <PageContainer>
      <PortalPageHeader
        title="Store Discounts & Campaigns"
        description="Create coupon codes and configure happy-hour pricing schemes."
      />
      <PortalEmptyState
        title="No campaigns active"
        description="Configure dynamic discount rules to drive local branch sales volume."
      />
    </PageContainer>
  );
};

// ─── Customers View Placeholder ──────────────────────────────────────────────
export const PortalCustomersView: React.FC = () => {
  return (
    <PageContainer>
      <PortalPageHeader
        title="Customer Feedback Hub"
        description="Read order reviews, rating metrics, and dietary analytics comments."
      />
      <PortalEmptyState
        title="No customer feedback recorded"
        description="Verified customer reviews appear here once orders are delivered."
      />
    </PageContainer>
  );
};

// ─── Settings View Placeholder ───────────────────────────────────────────────
export const PortalSettingsView: React.FC = () => {
  return (
    <PageContainer>
      <PortalPageHeader
        title="Portal Configurations Settings"
        description="Configure printing variables, order limits, and merchant profiles."
      />
      <PortalEmptyState
        title="All parameters optimal"
        description="Portal settings are synchronized from the primary corporate merchant configurations."
      />
    </PageContainer>
  );
};
