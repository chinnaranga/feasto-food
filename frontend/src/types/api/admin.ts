export interface AdminOverviewMetrics {
  activeOrdersCount: number;
  pendingRestaurantOrdersCount: number;
  activeDeliveriesCount: number;
  onlineRidersCount: number;
  onlineRestaurantsCount: number;
  pendingVerificationsCount: number;
  failedPaymentsCount: number;
  failedDispatchesCount: number;
  unresolvedOperationalIssuesCount: number;
}
