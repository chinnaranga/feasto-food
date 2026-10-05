import React from 'react';
import useRiderDashboardStore from '../../store/useRiderDashboardStore';
import { AlertCard } from '../../components/dashboard/RiderDashboardComponents';
import { RiderPageHeader, RiderEmptyState } from '../../components/RiderUIComponents';

export const RiderDashboardAlertsPage: React.FC = () => {
  const { alerts, dismissAlert } = useRiderDashboardStore();

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Operational Alerts & Reminders" subtitle="System warnings, zone surge alerts, and document expiration notices." />

      {alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onDismiss={dismissAlert} />
          ))}
        </div>
      ) : (
        <RiderEmptyState title="No Active Alerts" description="You have no pending alerts or warnings at this time." />
      )}
    </div>
  );
};

export default RiderDashboardAlertsPage;
