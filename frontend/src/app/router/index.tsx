import { lazy } from 'react';
import { createBrowserRouter, useRouteError, Navigate, useLocation } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { GuestRoute } from '@/components/auth/GuestRoute';

const LoginRedirect: React.FC = () => {
  const location = useLocation();
  return <Navigate to={`/auth/signin${location.search}`} replace />;
};

const RegisterRedirect: React.FC = () => {
  const location = useLocation();
  return <Navigate to={`/auth/signup${location.search}`} replace />;
};

const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })));
const Discover = lazy(() => import('@/pages/Discover').then(m => ({ default: m.Discover })));
const Restaurants = lazy(() => import('@/pages/Restaurants').then(m => ({ default: m.Restaurants })));
const RestaurantDetail = lazy(() => import('@/pages/RestaurantDetail').then(m => ({ default: m.RestaurantDetail })));
const Cart = lazy(() => import('@/pages/Cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('@/pages/Checkout').then(m => ({ default: m.Checkout })));
const CheckoutSuccess = lazy(() => import('@/pages/CheckoutSuccess').then(m => ({ default: m.CheckoutSuccess })));
const CheckoutFailure = lazy(() => import('@/pages/CheckoutFailure').then(m => ({ default: m.CheckoutFailure })));
const Profile = lazy(() => import('@/pages/Profile').then(m => ({ default: m.Profile })));
const Orders = lazy(() => import('@/pages/Orders').then(m => ({ default: m.Orders })));
const OrderDetail = lazy(() => import('@/pages/OrderDetail').then(m => ({ default: m.OrderDetail })));
const OrderTracking = lazy(() => import('@/pages/OrderTracking').then(m => ({ default: m.OrderTracking })));
const Notifications = lazy(() => import('@/pages/Notifications').then(m => ({ default: m.Notifications })));
const Support = lazy(() => import('@/pages/Support').then(m => ({ default: m.Support })));
const ContactSupport = lazy(() => import('@/pages/ContactSupport').then(m => ({ default: m.ContactSupport })));
const Settings = lazy(() => import('@/pages/Settings').then(m => ({ default: m.Settings })));
const SignIn = lazy(() => import('@/pages/SignIn').then(m => ({ default: m.SignIn })));
const SignUp = lazy(() => import('@/pages/SignUp').then(m => ({ default: m.SignUp })));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const VerifyOtp = lazy(() => import('@/pages/VerifyOtp').then(m => ({ default: m.VerifyOtp })));
const ResetPassword = lazy(() => import('@/pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const NotFound = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })));
const DocsLayout = lazy(() => import('@/components/docs/DocsLayout').then(m => ({ default: m.DocsLayout })));

// Restaurant Portal Lazy Load Sub-modules
const PortalAppShell = lazy(() => import('@/restaurant-portal/components/layout/PortalAppShell').then(m => ({ default: m.PortalAppShell })));
const DashboardLayout = lazy(() => import('@/restaurant-portal/components/layout/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const DashboardOverviewTab = lazy(() => import('@/restaurant-portal/features/dashboard/DashboardOverviewTab').then(m => ({ default: m.DashboardOverviewTab })));
const DashboardAlertsTab = lazy(() => import('@/restaurant-portal/features/dashboard/DashboardAlertsTab').then(m => ({ default: m.DashboardAlertsTab })));
const DashboardActivityTab = lazy(() => import('@/restaurant-portal/features/dashboard/DashboardActivityTab').then(m => ({ default: m.DashboardActivityTab })));
const PortalOrdersView = lazy(() => import('@/restaurant-portal/App').then(m => ({ default: m.PortalOrdersView })));
const MenuLayout = lazy(() => import('@/restaurant-portal/components/layout/MenuLayout').then(m => ({ default: m.MenuLayout })));
const MenuExplorer = lazy(() => import('@/restaurant-portal/features/menu/MenuExplorer').then(m => ({ default: m.MenuExplorer })));
const MenuEditor = lazy(() => import('@/restaurant-portal/features/menu/MenuEditor').then(m => ({ default: m.MenuEditor })));
const CategoryList = lazy(() => import('@/restaurant-portal/components/menu/CategoryList').then(m => ({ default: m.CategoryList })));
const CategoryTree = lazy(() => import('@/restaurant-portal/components/menu/CategoryTree').then(m => ({ default: m.CategoryTree })));
const CategoryEditor = lazy(() => import('@/restaurant-portal/features/menu/CategoryEditor').then(m => ({ default: m.CategoryEditor })));
const SectionList = lazy(() => import('@/restaurant-portal/components/menu/SectionCard').then(m => ({ default: m.SectionList })));
const SectionDetailPanel = lazy(() => import('@/restaurant-portal/components/menu/SectionCard').then(m => ({ default: m.SectionDetailPanel })));
const HierarchyPanel = lazy(() => import('@/restaurant-portal/features/menu/HierarchyPanel').then(m => ({ default: m.HierarchyPanel })));
const InventoryLayout = lazy(() => import('@/restaurant-portal/components/layout/InventoryLayout').then(m => ({ default: m.InventoryLayout })));
const InventoryExplorer = lazy(() => import('@/restaurant-portal/features/inventory/InventoryExplorer').then(m => ({ default: m.InventoryExplorer })));
const IngredientEditor = lazy(() => import('@/restaurant-portal/features/inventory/IngredientEditor').then(m => ({ default: m.IngredientEditor })));
const WasteTracker = lazy(() => import('@/restaurant-portal/features/inventory/WasteTracker').then(m => ({ default: m.WasteTracker })));
const StaffLayout = lazy(() => import('@/restaurant-portal/components/layout/StaffLayout').then(m => ({ default: m.StaffLayout })));
const StaffDirectory = lazy(() => import('@/restaurant-portal/features/staff/StaffDirectory').then(m => ({ default: m.StaffDirectory })));
const StaffProfileEditor = lazy(() => import('@/restaurant-portal/features/staff/StaffProfileEditor').then(m => ({ default: m.StaffProfileEditor })));
const RoleManager = lazy(() => import('@/restaurant-portal/features/staff/RoleManager').then(m => ({ default: m.RoleManager })));
const ShiftScheduler = lazy(() => import('@/restaurant-portal/features/staff/ShiftScheduler').then(m => ({ default: m.ShiftScheduler })));
const AttendanceTracker = lazy(() => import('@/restaurant-portal/features/staff/AttendanceTracker').then(m => ({ default: m.AttendanceTracker })));
const PerformanceHub = lazy(() => import('@/restaurant-portal/features/staff/PerformanceHub').then(m => ({ default: m.PerformanceHub })));
const AnalyticsLayout = lazy(() => import('@/restaurant-portal/components/layout/AnalyticsLayout').then(m => ({ default: m.AnalyticsLayout })));
const AnalyticsOverview = lazy(() => import('@/restaurant-portal/features/analytics/AnalyticsOverview').then(m => ({ default: m.AnalyticsOverview })));
const SalesAnalytics = lazy(() => import('@/restaurant-portal/features/analytics/SalesAnalytics').then(m => ({ default: m.SalesAnalytics })));
const MenuAnalytics = lazy(() => import('@/restaurant-portal/features/analytics/MenuAnalytics').then(m => ({ default: m.MenuAnalytics })));
const OperationsAnalytics = lazy(() => import('@/restaurant-portal/features/analytics/OperationsAnalytics').then(m => ({ default: m.OperationsAnalytics })));
const InventoryAnalytics = lazy(() => import('@/restaurant-portal/features/analytics/InventoryAnalytics').then(m => ({ default: m.InventoryAnalytics })));
const StaffAnalytics = lazy(() => import('@/restaurant-portal/features/analytics/StaffAnalytics').then(m => ({ default: m.StaffAnalytics })));
const FinanceAnalytics = lazy(() => import('@/restaurant-portal/features/analytics/FinanceAnalytics').then(m => ({ default: m.FinanceAnalytics })));
const BranchAnalytics = lazy(() => import('@/restaurant-portal/features/analytics/BranchAnalytics').then(m => ({ default: m.BranchAnalytics })));
const TimeAnalytics = lazy(() => import('@/restaurant-portal/features/analytics/TimeAnalytics').then(m => ({ default: m.TimeAnalytics })));
const PortalPromotionsView = lazy(() => import('@/restaurant-portal/App').then(m => ({ default: m.PortalPromotionsView })));
const FinanceLayout = lazy(() => import('@/restaurant-portal/components/layout/FinanceLayout').then(m => ({ default: m.FinanceLayout })));
const FinanceDashboard = lazy(() => import('@/restaurant-portal/features/finance/FinanceDashboard').then(m => ({ default: m.FinanceDashboard })));
const BillingView = lazy(() => import('@/restaurant-portal/features/finance/BillingView').then(m => ({ default: m.BillingView })));
const InvoicesView = lazy(() => import('@/restaurant-portal/features/finance/InvoicesView').then(m => ({ default: m.InvoicesView })));
const InvoiceDetailView = lazy(() => import('@/restaurant-portal/features/finance/InvoiceDetailView').then(m => ({ default: m.InvoiceDetailView })));
const PayoutsView = lazy(() => import('@/restaurant-portal/features/finance/PayoutsView').then(m => ({ default: m.PayoutsView })));
const PayoutDetailView = lazy(() => import('@/restaurant-portal/features/finance/PayoutDetailView').then(m => ({ default: m.PayoutDetailView })));
const TaxesView = lazy(() => import('@/restaurant-portal/features/finance/TaxesView').then(m => ({ default: m.TaxesView })));
const ExpensesView = lazy(() => import('@/restaurant-portal/features/finance/ExpensesView').then(m => ({ default: m.ExpensesView })));
const RefundsView = lazy(() => import('@/restaurant-portal/features/finance/RefundsView').then(m => ({ default: m.RefundsView })));
const ReconciliationView = lazy(() => import('@/restaurant-portal/features/finance/ReconciliationView').then(m => ({ default: m.ReconciliationView })));
const FeesView = lazy(() => import('@/restaurant-portal/features/finance/FeesView').then(m => ({ default: m.FeesView })));
const CustomersLayout = lazy(() => import('@/restaurant-portal/components/layout/CustomersLayout').then(m => ({ default: m.CustomersLayout })));
const CustomerTable = lazy(() => import('@/restaurant-portal/features/customers/CustomerTable').then(m => ({ default: m.CustomerTable })));
const CustomerForm = lazy(() => import('@/restaurant-portal/features/customers/CustomerForm').then(m => ({ default: m.CustomerForm })));
const CustomerSegments = lazy(() => import('@/restaurant-portal/features/customers/CustomerSegments').then(m => ({ default: m.CustomerSegments })));
const CustomerRetention = lazy(() => import('@/restaurant-portal/features/customers/CustomerRetention').then(m => ({ default: m.CustomerRetention })));
const CustomerNotes = lazy(() => import('@/restaurant-portal/features/customers/CustomerNotes').then(m => ({ default: m.CustomerNotes })));
const CustomerCommunication = lazy(() => import('@/restaurant-portal/features/customers/CustomerCommunication').then(m => ({ default: m.CustomerCommunication })));
const PortalSettingsView = lazy(() => import('@/restaurant-portal/App').then(m => ({ default: m.PortalSettingsView })));

const PortalGuestRoute = lazy(() => import('@/restaurant-portal/components/auth/PortalGuestRoute').then(m => ({ default: m.PortalGuestRoute })));
const PortalProtectedRoute = lazy(() => import('@/restaurant-portal/components/auth/PortalProtectedRoute').then(m => ({ default: m.PortalProtectedRoute })));
const AuthLayout = lazy(() => import('@/restaurant-portal/components/layout/AuthLayout').then(m => ({ default: m.AuthLayout })));
const PortalLoginForm = lazy(() => import('@/restaurant-portal/features/auth/LoginForm').then(m => ({ default: m.LoginForm })));
const PortalSignupForm = lazy(() => import('@/restaurant-portal/features/auth/SignupForm').then(m => ({ default: m.SignupForm || m.default })));
const PortalForgotPasswordForm = lazy(() => import('@/restaurant-portal/features/auth/ForgotPasswordForm').then(m => ({ default: m.ForgotPasswordForm || m.default })));
const PortalResetPasswordForm = lazy(() => import('@/restaurant-portal/features/auth/ResetPasswordForm').then(m => ({ default: m.ResetPasswordForm || m.default })));
const PortalInviteAcceptanceForm = lazy(() => import('@/restaurant-portal/features/auth/InviteAcceptanceForm').then(m => ({ default: m.InviteAcceptanceForm || m.default })));
const PortalVerificationCodeInput = lazy(() => import('@/restaurant-portal/features/auth/VerificationCodeInput').then(m => ({ default: m.VerificationCodeInput || m.default })));

// Onboarding Lazy Load Sub-modules
const OnboardingLayout = lazy(() => import('@/restaurant-portal/components/layout/OnboardingLayout').then(m => ({ default: m.OnboardingLayout })));
const OnboardingWelcome = lazy(() => import('@/restaurant-portal/features/onboarding/WelcomeStep').then(m => ({ default: m.WelcomeStep })));
const OnboardingWorkspace = lazy(() => import('@/restaurant-portal/features/onboarding/WorkspaceForm').then(m => ({ default: m.WorkspaceForm })));
const OnboardingProfile = lazy(() => import('@/restaurant-portal/features/onboarding/RestaurantProfileForm').then(m => ({ default: m.RestaurantProfileForm })));
const OnboardingBusiness = lazy(() => import('@/restaurant-portal/features/onboarding/BusinessDetailsForm').then(m => ({ default: m.BusinessDetailsForm })));
const OnboardingOperations = lazy(() => import('@/restaurant-portal/features/onboarding/OperationsPreferencesForm').then(m => ({ default: m.OperationsPreferencesForm })));
const OnboardingTeam = lazy(() => import('@/restaurant-portal/features/onboarding/TeamInviteForm').then(m => ({ default: m.TeamInviteForm })));
const OnboardingReview = lazy(() => import('@/restaurant-portal/features/onboarding/ReviewSummaryCard').then(m => ({ default: m.ReviewSummaryCard })));
const OnboardingSuccess = lazy(() => import('@/restaurant-portal/features/onboarding/SuccessStep').then(m => ({ default: m.SuccessStep })));

// Profile (Stage R4) Lazy Load Sub-modules
const ProfileLayout = lazy(() => import('@/restaurant-portal/components/layout/ProfileLayout').then(m => ({ default: m.ProfileLayout })));
const RestaurantIdentityTab = lazy(() => import('@/restaurant-portal/features/profile/RestaurantIdentityTab').then(m => ({ default: m.RestaurantIdentityTab })));
const BusinessIdentityTab = lazy(() => import('@/restaurant-portal/features/profile/BusinessIdentityTab').then(m => ({ default: m.BusinessIdentityTab })));
const LocationTab = lazy(() => import('@/restaurant-portal/features/profile/LocationTab').then(m => ({ default: m.LocationTab })));
const OperationsTab = lazy(() => import('@/restaurant-portal/features/profile/OperationsTab').then(m => ({ default: m.OperationsTab })));
const BrandingTab = lazy(() => import('@/restaurant-portal/features/profile/BrandingTab').then(m => ({ default: m.BrandingTab })));
const WorkspaceSettingsTab = lazy(() => import('@/restaurant-portal/features/profile/WorkspaceSettingsTab').then(m => ({ default: m.WorkspaceSettingsTab })));
const LivePreviewTab = lazy(() => import('@/restaurant-portal/features/profile/LivePreviewTab').then(m => ({ default: m.LivePreviewTab })));

// Admin Lazy Load Sub-modules
const AdminLayout = lazy(() => import('@/pages/admin/layout/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard })));
const AdminRestaurants = lazy(() => import('@/pages/admin/Restaurants').then(m => ({ default: m.AdminRestaurants })));
const AdminOrders = lazy(() => import('@/pages/admin/Orders').then(m => ({ default: m.Orders })));
const AdminDelivery = lazy(() => import('@/pages/admin/Delivery').then(m => ({ default: m.Delivery })));
const AdminAnalytics = lazy(() => import('@/pages/admin/Analytics').then(m => ({ default: m.Analytics })));
const AdminPayments = lazy(() => import('@/pages/admin/Payments').then(m => ({ default: m.Payments })));
const RestaurantDetailPanel = lazy(() => import('@/pages/admin/RestaurantDetailPanel').then(m => ({ default: m.RestaurantDetailPanel })));
const AdminUsers = lazy(() => import('@/pages/admin/Users').then(m => ({ default: m.AdminUsers })));
const UserDetailPanel = lazy(() => import('@/pages/admin/UserDetailPanel').then(m => ({ default: m.UserDetailPanel })));
const TrustSafety = lazy(() => import('@/pages/admin/TrustSafety').then(m => ({ default: m.TrustSafety })));
const AdminSupport = lazy(() => import('@/pages/admin/Support').then(m => ({ default: m.AdminSupport })));
const FeatureFlags = lazy(() => import('@/pages/admin/FeatureFlags').then(m => ({ default: m.FeatureFlags })));
const AuditLogs = lazy(() => import('@/pages/admin/AuditLogs').then(m => ({ default: m.AuditLogs })));
const AdminContent = lazy(() => import('@/pages/admin/Content').then(m => ({ default: m.AdminContent })));
const AdminSettings = lazy(() => import('@/pages/admin/Settings').then(m => ({ default: m.AdminSettings })));
const SystemHealth = lazy(() => import('@/pages/admin/SystemHealth').then(m => ({ default: m.SystemHealth })));
const SecurityLayout = lazy(() => import('@/pages/admin/security/SecurityLayout').then(m => ({ default: m.SecurityLayout })));
const SecurityDashboard = lazy(() => import('@/pages/admin/security/SecurityDashboard').then(m => ({ default: m.SecurityDashboard })));
const IncidentManagement = lazy(() => import('@/pages/admin/security/IncidentManagement').then(m => ({ default: m.IncidentManagement })));
const ComplianceOverview = lazy(() => import('@/pages/admin/security/ComplianceOverview').then(m => ({ default: m.ComplianceOverview })));
const PrivacyRequests = lazy(() => import('@/pages/admin/security/PrivacyRequests').then(m => ({ default: m.PrivacyRequests })));
const AccessSecurity = lazy(() => import('@/pages/admin/security/AccessSecurity').then(m => ({ default: m.AccessSecurity })));
const SensitiveActions = lazy(() => import('@/pages/admin/security/SensitiveActions').then(m => ({ default: m.SensitiveActions })));
const AuditReadiness = lazy(() => import('@/pages/admin/security/AuditReadiness').then(m => ({ default: m.AuditReadiness })));
const PolicyManagement = lazy(() => import('@/pages/admin/security/PolicyManagement').then(m => ({ default: m.PolicyManagement })));
const RiskMonitoring = lazy(() => import('@/pages/admin/security/RiskMonitoring').then(m => ({ default: m.RiskMonitoring })));
const DataProtection = lazy(() => import('@/pages/admin/security/DataProtection').then(m => ({ default: m.DataProtection })));
const ObservabilityLayout = lazy(() => import('@/pages/admin/observability/ObservabilityLayout').then(m => ({ default: m.ObservabilityLayout })));
const ObservabilityDashboard = lazy(() => import('@/pages/admin/observability/ObservabilityDashboard').then(m => ({ default: m.ObservabilityDashboard })));
const PerformanceMonitoring = lazy(() => import('@/pages/admin/observability/PerformanceMonitoring').then(m => ({ default: m.PerformanceMonitoring })));
const ErrorMonitoring = lazy(() => import('@/pages/admin/observability/ErrorMonitoring').then(m => ({ default: m.ErrorMonitoring })));
const UptimeAvailability = lazy(() => import('@/pages/admin/observability/UptimeAvailability').then(m => ({ default: m.UptimeAvailability })));
const RequestQueueHealth = lazy(() => import('@/pages/admin/observability/RequestQueueHealth').then(m => ({ default: m.RequestQueueHealth })));
const DeploymentHealth = lazy(() => import('@/pages/admin/observability/DeploymentHealth').then(m => ({ default: m.DeploymentHealth })));
const IncidentIntelligence = lazy(() => import('@/pages/admin/observability/IncidentIntelligence').then(m => ({ default: m.IncidentIntelligence })));
const DiagnosticsTracing = lazy(() => import('@/pages/admin/observability/DiagnosticsTracing').then(m => ({ default: m.DiagnosticsTracing })));
const ModuleHealth = lazy(() => import('@/pages/admin/observability/ModuleHealth').then(m => ({ default: m.ModuleHealth })));
const ReleaseLayout = lazy(() => import('@/pages/admin/release/ReleaseLayout').then(m => ({ default: m.ReleaseLayout })));
const ReleaseDashboard = lazy(() => import('@/pages/admin/release/ReleaseDashboard').then(m => ({ default: m.ReleaseDashboard })));
const BuildValidation = lazy(() => import('@/pages/admin/release/BuildValidation').then(m => ({ default: m.BuildValidation })));
const EnvironmentSafety = lazy(() => import('@/pages/admin/release/EnvironmentSafety').then(m => ({ default: m.EnvironmentSafety })));
const VersioningManagement = lazy(() => import('@/pages/admin/release/VersioningManagement').then(m => ({ default: m.VersioningManagement })));
const DeploymentReadiness = lazy(() => import('@/pages/admin/release/DeploymentReadiness').then(m => ({ default: m.DeploymentReadiness })));
const UpdateRecovery = lazy(() => import('@/pages/admin/release/UpdateRecovery').then(m => ({ default: m.UpdateRecovery })));
const RollbackSupport = lazy(() => import('@/pages/admin/release/RollbackSupport').then(m => ({ default: m.RollbackSupport })));
const ReleaseNotes = lazy(() => import('@/pages/admin/release/ReleaseNotes').then(m => ({ default: m.ReleaseNotes })));
const ReadinessChecklist = lazy(() => import('@/pages/admin/release/ReadinessChecklist').then(m => ({ default: m.ReadinessChecklist })));
const DocsOverview = lazy(() => import('@/pages/docs/DocsOverview').then(m => ({ default: m.DocsOverview })));
const DocsTokens = lazy(() => import('@/pages/docs/DocsTokens').then(m => ({ default: m.DocsTokens })));
const DocsComponentShowcase = lazy(() => import('@/pages/docs/DocsComponentShowcase').then(m => ({ default: m.DocsComponentShowcase })));
const DocsPatterns = lazy(() => import('@/pages/docs/DocsPatterns').then(m => ({ default: m.DocsPatterns })));
const DocsAccessibility = lazy(() => import('@/pages/docs/DocsAccessibility').then(m => ({ default: m.DocsAccessibility })));
const DocsOnboarding = lazy(() => import('@/pages/docs/DocsOnboarding').then(m => ({ default: m.DocsOnboarding })));
const QualityLayout = lazy(() => import('@/pages/quality/QualityLayout').then(m => ({ default: m.QualityLayout })));
const QualityOverview = lazy(() => import('@/pages/quality/QualityOverview').then(m => ({ default: m.QualityOverview })));
const TestSuites = lazy(() => import('@/pages/quality/TestSuites').then(m => ({ default: m.TestSuites })));
const WorkflowCoverage = lazy(() => import('@/pages/quality/WorkflowCoverage').then(m => ({ default: m.WorkflowCoverage })));
const AccessibilityAudit = lazy(() => import('@/pages/quality/AccessibilityAudit').then(m => ({ default: m.AccessibilityAudit })));
const PerformanceBudget = lazy(() => import('@/pages/quality/PerformanceBudget').then(m => ({ default: m.PerformanceBudget })));
const ResponsivenessMatrix = lazy(() => import('@/pages/quality/ResponsivenessMatrix').then(m => ({ default: m.ResponsivenessMatrix })));
const RegressionCoverage = lazy(() => import('@/pages/quality/RegressionCoverage').then(m => ({ default: m.RegressionCoverage })));
const BrowserMatrix = lazy(() => import('@/pages/quality/BrowserMatrix').then(m => ({ default: m.BrowserMatrix })));
const ReleaseConfidence = lazy(() => import('@/pages/quality/ReleaseConfidence').then(m => ({ default: m.ReleaseConfidence })));
const ErrorRecovery = lazy(() => import('@/pages/quality/ErrorRecovery').then(m => ({ default: m.ErrorRecovery })));

const IntegrationsLayout = lazy(() => import('@/pages/integrations/IntegrationsLayout').then(m => ({ default: m.IntegrationsLayout })));
const IntegrationsDashboard = lazy(() => import('@/pages/integrations/IntegrationsDashboard').then(m => ({ default: m.IntegrationsDashboard })));
const AppConnectionsPage = lazy(() => import('@/pages/integrations/AppConnectionsPage').then(m => ({ default: m.AppConnectionsPage })));
const WebhooksPage = lazy(() => import('@/pages/integrations/WebhooksPage').then(m => ({ default: m.WebhooksPage })));
const AutomationsPage = lazy(() => import('@/pages/integrations/AutomationsPage').then(m => ({ default: m.AutomationsPage })));
const ApiCenterPage = lazy(() => import('@/pages/integrations/ApiCenterPage').then(m => ({ default: m.ApiCenterPage })));
const SyncHealthPage = lazy(() => import('@/pages/integrations/SyncHealthPage').then(m => ({ default: m.SyncHealthPage })));
const IntegrationLogsPage = lazy(() => import('@/pages/integrations/IntegrationLogsPage').then(m => ({ default: m.IntegrationLogsPage })));
const MarketplacePage = lazy(() => import('@/pages/integrations/MarketplacePage').then(m => ({ default: m.MarketplacePage })));
const IntegrationSettingsPage = lazy(() => import('@/pages/integrations/IntegrationSettingsPage').then(m => ({ default: m.IntegrationSettingsPage })));

const BranchLayout = lazy(() => import('@/pages/branches/BranchLayout').then(m => ({ default: m.BranchLayout })));
const BranchOverviewPage = lazy(() => import('@/pages/branches/BranchOverviewPage').then(m => ({ default: m.BranchOverviewPage })));
const BranchDirectoryPage = lazy(() => import('@/pages/branches/BranchDirectoryPage').then(m => ({ default: m.BranchDirectoryPage })));
const NewBranchPage = lazy(() => import('@/pages/branches/NewBranchPage').then(m => ({ default: m.NewBranchPage })));
const BranchDetailPage = lazy(() => import('@/pages/branches/BranchDetailPage').then(m => ({ default: m.BranchDetailPage })));
const BranchHoursPage = lazy(() => import('@/pages/branches/BranchHoursPage').then(m => ({ default: m.BranchHoursPage })));
const BranchAssignmentsPage = lazy(() => import('@/pages/branches/BranchAssignmentsPage').then(m => ({ default: m.BranchAssignmentsPage })));
const DeliveryZonesPage = lazy(() => import('@/pages/branches/DeliveryZonesPage').then(m => ({ default: m.DeliveryZonesPage })));
const BranchComparisonPage = lazy(() => import('@/pages/branches/BranchComparisonPage').then(m => ({ default: m.BranchComparisonPage })));
const BranchReadinessPage = lazy(() => import('@/pages/branches/BranchReadinessPage').then(m => ({ default: m.BranchReadinessPage })));
const RegionConfigPage = lazy(() => import('@/pages/branches/RegionConfigPage').then(m => ({ default: m.RegionConfigPage })));

const RiderAppShell = lazy(() => import('@/rider/components/RiderAppShell').then(m => ({ default: m.RiderAppShell })));
const RiderDashboardPage = lazy(() => import('@/rider/pages/RiderDashboardPage').then(m => ({ default: m.RiderDashboardPage })));
const RiderHistoryPage = lazy(() => import('@/rider/pages/RiderHistoryPage').then(m => ({ default: m.RiderHistoryPage })));
const RiderNotificationsPage = lazy(() => import('@/rider/pages/RiderNotificationsPage').then(m => ({ default: m.RiderNotificationsPage })));
const RiderSupportPage = lazy(() => import('@/rider/pages/RiderSupportPage').then(m => ({ default: m.RiderSupportPage })));
const RiderSettingsPage = lazy(() => import('@/rider/pages/RiderSettingsPage').then(m => ({ default: m.RiderSettingsPage })));

const RiderDashboardLayout = lazy(() => import('@/rider/pages/dashboard/RiderDashboardLayout').then(m => ({ default: m.RiderDashboardLayout })));
const RiderDashboardHomePage = lazy(() => import('@/rider/pages/dashboard/RiderDashboardHomePage').then(m => ({ default: m.RiderDashboardHomePage })));
const RiderDashboardTodayPage = lazy(() => import('@/rider/pages/dashboard/RiderDashboardTodayPage').then(m => ({ default: m.RiderDashboardTodayPage })));
const RiderDashboardAlertsPage = lazy(() => import('@/rider/pages/dashboard/RiderDashboardAlertsPage').then(m => ({ default: m.RiderDashboardAlertsPage })));
const RiderDashboardSummaryPage = lazy(() => import('@/rider/pages/dashboard/RiderDashboardSummaryPage').then(m => ({ default: m.RiderDashboardSummaryPage })));
const RiderDashboardOverviewPage = lazy(() => import('@/rider/pages/dashboard/RiderDashboardOverviewPage').then(m => ({ default: m.RiderDashboardOverviewPage })));

const RiderOrdersLayout = lazy(() => import('@/rider/pages/orders/RiderOrdersLayout').then(m => ({ default: m.RiderOrdersLayout })));
const RiderOrdersAvailablePage = lazy(() => import('@/rider/pages/orders/RiderOrdersAvailablePage').then(m => ({ default: m.RiderOrdersAvailablePage })));
const RiderOrdersPriorityPage = lazy(() => import('@/rider/pages/orders/RiderOrdersPriorityPage').then(m => ({ default: m.RiderOrdersPriorityPage })));
const RiderOrdersScheduledPage = lazy(() => import('@/rider/pages/orders/RiderOrdersScheduledPage').then(m => ({ default: m.RiderOrdersScheduledPage })));
const RiderOrdersAssignedPage = lazy(() => import('@/rider/pages/orders/RiderOrdersAssignedPage').then(m => ({ default: m.RiderOrdersAssignedPage })));
const RiderOrdersHistoryPage = lazy(() => import('@/rider/pages/orders/RiderOrdersHistoryPage').then(m => ({ default: m.RiderOrdersHistoryPage })));
const RiderOrderDetailPage = lazy(() => import('@/rider/pages/orders/RiderOrderDetailPage').then(m => ({ default: m.RiderOrderDetailPage })));

const RiderActiveLayout = lazy(() => import('@/rider/pages/active/RiderActiveLayout').then(m => ({ default: m.RiderActiveLayout })));
const RiderActiveHomePage = lazy(() => import('@/rider/pages/active/RiderActiveHomePage').then(m => ({ default: m.RiderActiveHomePage })));
const RiderActivePickupPage = lazy(() => import('@/rider/pages/active/RiderActivePickupPage').then(m => ({ default: m.RiderActivePickupPage })));
const RiderActiveDeliveryPage = lazy(() => import('@/rider/pages/active/RiderActiveDeliveryPage').then(m => ({ default: m.RiderActiveDeliveryPage })));
const RiderActiveRoutePage = lazy(() => import('@/rider/pages/active/RiderActiveRoutePage').then(m => ({ default: m.RiderActiveRoutePage })));
const RiderActiveStatusPage = lazy(() => import('@/rider/pages/active/RiderActiveStatusPage').then(m => ({ default: m.RiderActiveStatusPage })));
const RiderActiveExceptionsPage = lazy(() => import('@/rider/pages/active/RiderActiveExceptionsPage').then(m => ({ default: m.RiderActiveExceptionsPage })));
const RiderActiveDetailPage = lazy(() => import('@/rider/pages/active/RiderActiveDetailPage').then(m => ({ default: m.RiderActiveDetailPage })));

const RiderNavigationLayout = lazy(() => import('@/rider/pages/navigation/RiderNavigationLayout').then(m => ({ default: m.RiderNavigationLayout })));
const RiderNavigationLivePage = lazy(() => import('@/rider/pages/navigation/RiderNavigationLivePage').then(m => ({ default: m.RiderNavigationLivePage })));
const RiderNavigationRoutePage = lazy(() => import('@/rider/pages/navigation/RiderNavigationRoutePage').then(m => ({ default: m.RiderNavigationRoutePage })));
const RiderNavigationMapPage = lazy(() => import('@/rider/pages/navigation/RiderNavigationMapPage').then(m => ({ default: m.RiderNavigationMapPage })));
const RiderNavigationETAPage = lazy(() => import('@/rider/pages/navigation/RiderNavigationETAPage').then(m => ({ default: m.RiderNavigationETAPage })));
const RiderNavigationAlertsPage = lazy(() => import('@/rider/pages/navigation/RiderNavigationAlertsPage').then(m => ({ default: m.RiderNavigationAlertsPage })));
const RiderNavigationDetailPage = lazy(() => import('@/rider/pages/navigation/RiderNavigationDetailPage').then(m => ({ default: m.RiderNavigationDetailPage })));

const RiderEarningsLayout = lazy(() => import('@/rider/pages/earnings/RiderEarningsLayout').then(m => ({ default: m.RiderEarningsLayout })));
const RiderEarningsTodayPage = lazy(() => import('@/rider/pages/earnings/RiderEarningsTodayPage').then(m => ({ default: m.RiderEarningsTodayPage })));
const RiderEarningsWeeklyPage = lazy(() => import('@/rider/pages/earnings/RiderEarningsWeeklyPage').then(m => ({ default: m.RiderEarningsWeeklyPage })));
const RiderEarningsMonthlyPage = lazy(() => import('@/rider/pages/earnings/RiderEarningsMonthlyPage').then(m => ({ default: m.RiderEarningsMonthlyPage })));
const RiderEarningsBreakdownPage = lazy(() => import('@/rider/pages/earnings/RiderEarningsBreakdownPage').then(m => ({ default: m.RiderEarningsBreakdownPage })));
const RiderEarningsWalletPage = lazy(() => import('@/rider/pages/earnings/RiderEarningsWalletPage').then(m => ({ default: m.RiderEarningsWalletPage })));
const RiderEarningsPayoutsPage = lazy(() => import('@/rider/pages/earnings/RiderEarningsPayoutsPage').then(m => ({ default: m.RiderEarningsPayoutsPage })));
const RiderEarningsBonusesPage = lazy(() => import('@/rider/pages/earnings/RiderEarningsBonusesPage').then(m => ({ default: m.RiderEarningsBonusesPage })));
const RiderEarningsDeductionsPage = lazy(() => import('@/rider/pages/earnings/RiderEarningsDeductionsPage').then(m => ({ default: m.RiderEarningsDeductionsPage })));
const RiderEarningsStatementsPage = lazy(() => import('@/rider/pages/earnings/RiderEarningsStatementsPage').then(m => ({ default: m.RiderEarningsStatementsPage })));
const RiderLoginPage = lazy(() => import('@/rider/pages/auth/RiderLoginPage').then(m => ({ default: m.RiderLoginPage })));
const RiderWelcomePage = lazy(() => import('@/rider/pages/auth/RiderWelcomePage').then(m => ({ default: m.RiderWelcomePage })));
const RiderRegisterPage = lazy(() => import('@/rider/pages/auth/RiderRegisterPage').then(m => ({ default: m.RiderRegisterPage })));
const RiderOtpPage = lazy(() => import('@/rider/pages/auth/RiderOtpPage').then(m => ({ default: m.RiderOtpPage })));
const RiderEmailVerifyPage = lazy(() => import('@/rider/pages/auth/RiderEmailVerifyPage').then(m => ({ default: m.RiderEmailVerifyPage })));
const RiderIdentityVerifyPage = lazy(() => import('@/rider/pages/auth/RiderIdentityVerifyPage').then(m => ({ default: m.RiderIdentityVerifyPage })));
const RiderDocumentsUploadPage = lazy(() => import('@/rider/pages/auth/RiderDocumentsUploadPage').then(m => ({ default: m.RiderDocumentsUploadPage })));
const RiderVehicleVerifyPage = lazy(() => import('@/rider/pages/auth/RiderVehicleVerifyPage').then(m => ({ default: m.RiderVehicleVerifyPage })));
const RiderAccountReviewPage = lazy(() => import('@/rider/pages/auth/RiderAccountReviewPage').then(m => ({ default: m.RiderAccountReviewPage })));
const RiderAccountApprovedPage = lazy(() => import('@/rider/pages/auth/RiderAccountApprovedPage').then(m => ({ default: m.RiderAccountApprovedPage })));
const RiderForgotPasswordPage = lazy(() => import('@/rider/pages/auth/RiderForgotPasswordPage').then(m => ({ default: m.RiderForgotPasswordPage })));
const RiderResetPasswordPage = lazy(() => import('@/rider/pages/auth/RiderResetPasswordPage').then(m => ({ default: m.RiderResetPasswordPage })));

const RiderProfileLayout = lazy(() => import('@/rider/pages/profile/RiderProfileLayout').then(m => ({ default: m.RiderProfileLayout })));
const RiderProfileOverviewPage = lazy(() => import('@/rider/pages/profile/RiderProfileOverviewPage').then(m => ({ default: m.RiderProfileOverviewPage })));
const RiderProfileEditPage = lazy(() => import('@/rider/pages/profile/RiderProfileEditPage').then(m => ({ default: m.RiderProfileEditPage })));
const RiderProfileContactPage = lazy(() => import('@/rider/pages/profile/RiderProfileContactPage').then(m => ({ default: m.RiderProfileContactPage })));
const RiderProfileVehiclePage = lazy(() => import('@/rider/pages/profile/RiderProfileVehiclePage').then(m => ({ default: m.RiderProfileVehiclePage })));
const RiderProfileDocumentsPage = lazy(() => import('@/rider/pages/profile/RiderProfileDocumentsPage').then(m => ({ default: m.RiderProfileDocumentsPage })));
const RiderProfileAvailabilityPage = lazy(() => import('@/rider/pages/profile/RiderProfileAvailabilityPage').then(m => ({ default: m.RiderProfileAvailabilityPage })));
const RiderProfileServiceAreaPage = lazy(() => import('@/rider/pages/profile/RiderProfileServiceAreaPage').then(m => ({ default: m.RiderProfileServiceAreaPage })));
const RiderProfilePreferencesPage = lazy(() => import('@/rider/pages/profile/RiderProfilePreferencesPage').then(m => ({ default: m.RiderProfilePreferencesPage })));
const RiderProfilePayoutPage = lazy(() => import('@/rider/pages/profile/RiderProfilePayoutPage').then(m => ({ default: m.RiderProfilePayoutPage })));
const RiderProfileReadinessPage = lazy(() => import('@/rider/pages/profile/RiderProfileReadinessPage').then(m => ({ default: m.RiderProfileReadinessPage })));

function GlobalErrorBoundary() {
  const error = useRouteError();
  console.error('Route boundary captured error:', error);

  const isChunkError =
    error &&
    typeof error === 'object' &&
    ('message' in error || 'name' in error) &&
    (/Failed to fetch dynamically imported module/i.test((error as any).message || '') ||
      /chunk/i.test((error as any).message || ''));

  if (isChunkError) {
    window.location.reload();
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-secondary-bg text-center p-6">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-brand-orange border-t-transparent mb-4" />
        <p className="text-xs font-bold text-text-primary">Updating Feasto to the latest version...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary-bg text-center p-6">
      <div className="max-w-md bg-white border border-border-main p-8 rounded-2xl shadow-sm text-left">
        <h2 className="text-sm font-extrabold text-text-primary tracking-tight font-heading mb-2">
          Application Error
        </h2>
        <p className="text-xs text-text-secondary leading-relaxed mb-6">
          An unexpected error occurred in the application. Please try reloading the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'discover',
        element: <Discover />,
      },
      {
        path: 'restaurants',
        element: <Restaurants />,
      },
      {
        path: 'restaurants/:id',
        element: <RestaurantDetail />,
      },
      {
        path: 'restaurants/:id/menu',
        element: <RestaurantDetail />,
      },
      {
        path: 'restaurants/:id/menu/:itemId',
        element: <RestaurantDetail />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'login',
        element: <LoginRedirect />,
      },
      {
        path: 'register',
        element: <RegisterRedirect />,
      },
      {
        path: 'support',
        element: <Support />,
      },
      {
        path: 'support/contact',
        element: <ContactSupport />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'checkout',
            element: <Checkout />,
          },
          {
            path: 'checkout/success',
            element: <CheckoutSuccess />,
          },
          {
            path: 'checkout/failure',
            element: <CheckoutFailure />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'profile/addresses',
            element: <Profile />,
          },
          {
            path: 'profile/favorites',
            element: <Profile />,
          },
          {
            path: 'profile/settings',
            element: <Profile />,
          },
          {
            path: 'profile/loyalty',
            element: <Profile />,
          },
          {
            path: 'notifications',
            element: <Notifications />,
          },
          {
            path: 'notifications/settings',
            element: <Notifications />,
          },
          {
            path: 'settings',
            element: <Settings />,
          },
          {
            path: 'settings/security',
            element: <Settings />,
          },
          {
            path: 'settings/privacy',
            element: <Settings />,
          },
          {
            path: 'settings/notifications',
            element: <Settings />,
          },
          {
            path: 'orders',
            element: <Orders />,
          },
          {
            path: 'orders/:id',
            element: <OrderDetail />,
          },
          {
            path: 'orders/:id/track',
            element: <OrderTracking />,
          },
        ],
      },
    ],
  },
  {
    path: 'auth',
    element: <GuestRoute />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        path: 'signin',
        element: <SignIn />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'verify-otp',
        element: <VerifyOtp />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: 'admin',
    element: <AdminLayout />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'orders',
        element: <AdminOrders />,
      },
      {
        path: 'delivery',
        element: <AdminDelivery />,
      },
      {
        path: 'riders',
        element: <AdminDelivery />,
      },
      {
        path: 'analytics',
        element: <AdminAnalytics />,
      },
      {
        path: 'payments',
        element: <AdminPayments />,
      },
      {
        path: 'restaurants',
        element: <AdminRestaurants />,
      },
      {
        path: 'restaurants/:id',
        element: <RestaurantDetailPanel />,
      },
      {
        path: 'users',
        element: <AdminUsers />,
      },
      {
        path: 'users/:id',
        element: <UserDetailPanel />,
      },
      {
        path: 'trust-safety',
        element: <TrustSafety />,
      },
      {
        path: 'support',
        element: <AdminSupport />,
      },
      {
        path: 'flags',
        element: <FeatureFlags />,
      },
      {
        path: 'audit-logs',
        element: <AuditLogs />,
      },
      {
        path: 'content',
        element: <AdminContent />,
      },
      {
        path: 'settings',
        element: <AdminSettings />,
      },
      {
        path: 'health',
        element: <SystemHealth />,
      },
      {
        path: 'security',
        element: <SecurityLayout />,
        children: [
          {
            index: true,
            element: <SecurityDashboard />,
          },
          {
            path: 'dashboard',
            element: <SecurityDashboard />,
          },
          {
            path: 'incidents',
            element: <IncidentManagement />,
          },
          {
            path: 'compliance',
            element: <ComplianceOverview />,
          },
          {
            path: 'privacy-requests',
            element: <PrivacyRequests />,
          },
          {
            path: 'access',
            element: <AccessSecurity />,
          },
          {
            path: 'sensitive-actions',
            element: <SensitiveActions />,
          },
          {
            path: 'audit-readiness',
            element: <AuditReadiness />,
          },
          {
            path: 'policies',
            element: <PolicyManagement />,
          },
          {
            path: 'risk',
            element: <RiskMonitoring />,
          },
          {
            path: 'data-protection',
            element: <DataProtection />,
          },
        ],
      },
      {
        path: 'observability',
        element: <ObservabilityLayout />,
        children: [
          {
            index: true,
            element: <ObservabilityDashboard />,
          },
          {
            path: 'dashboard',
            element: <ObservabilityDashboard />,
          },
          {
            path: 'performance',
            element: <PerformanceMonitoring />,
          },
          {
            path: 'errors',
            element: <ErrorMonitoring />,
          },
          {
            path: 'uptime',
            element: <UptimeAvailability />,
          },
          {
            path: 'requests',
            element: <RequestQueueHealth />,
          },
          {
            path: 'deployments',
            element: <DeploymentHealth />,
          },
          {
            path: 'incidents',
            element: <IncidentIntelligence />,
          },
          {
            path: 'diagnostics',
            element: <DiagnosticsTracing />,
          },
          {
            path: 'modules',
            element: <ModuleHealth />,
          },
        ],
      },
      {
        path: 'release',
        element: <ReleaseLayout />,
        children: [
          {
            index: true,
            element: <ReleaseDashboard />,
          },
          {
            path: 'dashboard',
            element: <ReleaseDashboard />,
          },
          {
            path: 'builds',
            element: <BuildValidation />,
          },
          {
            path: 'environment',
            element: <EnvironmentSafety />,
          },
          {
            path: 'versions',
            element: <VersioningManagement />,
          },
          {
            path: 'deployments',
            element: <DeploymentReadiness />,
          },
          {
            path: 'readiness',
            element: <ReadinessChecklist />,
          },
          {
            path: 'update',
            element: <UpdateRecovery />,
          },
          {
            path: 'rollback',
            element: <RollbackSupport />,
          },
          {
            path: 'notes',
            element: <ReleaseNotes />,
          },
        ],
      },
      {
        path: 'docs',
        element: <DocsLayout />,
        children: [
          {
            index: true,
            element: <DocsOverview />,
          },
          {
            path: 'overview',
            element: <DocsOverview />,
          },
          {
            path: 'tokens',
            element: <DocsTokens />,
          },
          {
            path: 'components',
            element: <DocsComponentShowcase />,
          },
          {
            path: 'patterns',
            element: <DocsPatterns />,
          },
          {
            path: 'accessibility',
            element: <DocsAccessibility />,
          },
          {
            path: 'onboarding',
            element: <DocsOnboarding />,
          },
        ],
      },
      {
        path: 'quality',
        element: <QualityLayout />,
        children: [
          { index: true, element: <QualityOverview /> },
          { path: 'overview', element: <QualityOverview /> },
          { path: 'test-suites', element: <TestSuites /> },
          { path: 'workflows', element: <WorkflowCoverage /> },
          { path: 'accessibility', element: <AccessibilityAudit /> },
          { path: 'performance', element: <PerformanceBudget /> },
          { path: 'responsiveness', element: <ResponsivenessMatrix /> },
          { path: 'regressions', element: <RegressionCoverage /> },
          { path: 'browser-matrix', element: <BrowserMatrix /> },
          { path: 'release-confidence', element: <ReleaseConfidence /> },
          { path: 'error-recovery', element: <ErrorRecovery /> },
        ],
      },
    ],
  },
  {
    path: 'docs',
    element: <DocsLayout />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        index: true,
        element: <DocsOverview />,
      },
      {
        path: 'overview',
        element: <DocsOverview />,
      },
      {
        path: 'tokens',
        element: <DocsTokens />,
      },
      {
        path: 'components',
        element: <DocsComponentShowcase />,
      },
      {
        path: 'patterns',
        element: <DocsPatterns />,
      },
      {
        path: 'accessibility',
        element: <DocsAccessibility />,
      },
      {
        path: 'onboarding',
        element: <DocsOnboarding />,
      },
    ],
  },
  {
    path: 'restaurant-portal',
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        element: <PortalGuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                path: 'login',
                element: <PortalLoginForm />,
              },
              {
                path: 'signup',
                element: <PortalSignupForm />,
              },
              {
                path: 'forgot-password',
                element: <PortalForgotPasswordForm />,
              },
              {
                path: 'reset-password',
                element: <PortalResetPasswordForm />,
              },
              {
                path: 'invite/:token',
                element: <PortalInviteAcceptanceForm />,
              },
            ],
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'verify',
            element: <PortalVerificationCodeInput />,
          },
        ],
      },
      {
        element: <PortalProtectedRoute />,
        children: [
          {
            path: 'onboarding',
            element: <OnboardingLayout />,
            children: [
              {
                path: '',
                element: <OnboardingWelcome />,
              },
              {
                path: 'workspace',
                element: <OnboardingWorkspace />,
              },
              {
                path: 'profile',
                element: <OnboardingProfile />,
              },
              {
                path: 'business',
                element: <OnboardingBusiness />,
              },
              {
                path: 'operations',
                element: <OnboardingOperations />,
              },
              {
                path: 'team',
                element: <OnboardingTeam />,
              },
              {
                path: 'review',
                element: <OnboardingReview />,
              },
              {
                path: 'success',
                element: <OnboardingSuccess />,
              },
            ],
          },
          {
            element: <PortalAppShell />,
            children: [
              {
                path: '',
                element: <DashboardLayout />,
                children: [
                  {
                    index: true,
                    element: <DashboardOverviewTab />,
                  },
                ],
              },
              {
                path: 'dashboard',
                element: <DashboardLayout />,
                children: [
                  {
                    index: true,
                    element: <DashboardOverviewTab />,
                  },
                  {
                    path: 'overview',
                    element: <DashboardOverviewTab />,
                  },
                  {
                    path: 'alerts',
                    element: <DashboardAlertsTab />,
                  },
                  {
                    path: 'activity',
                    element: <DashboardActivityTab />,
                  },
                ],
              },
              {
                path: 'orders',
                element: <PortalOrdersView />,
              },
              {
                path: 'kitchen',
                element: <PortalOrdersView />,
              },
              {
                path: 'crm',
                element: <CustomersLayout />,
                children: [
                  { index: true, element: <CustomerTable /> },
                  { path: 'new', element: <CustomerForm /> },
                  { path: ':id/edit', element: <CustomerForm /> },
                  { path: 'segments', element: <CustomerSegments /> },
                  { path: 'retention', element: <CustomerRetention /> },
                  { path: 'notes', element: <CustomerNotes /> },
                  { path: 'communication', element: <CustomerCommunication /> },
                ],
              },
              {
                path: 'menu',
                element: <MenuLayout />,
                children: [
                  {
                    index: true,
                    element: <MenuExplorer />,
                  },
                  {
                    path: 'new',
                    element: <MenuEditor />,
                  },
                  {
                    path: ':id',
                    element: <MenuEditor />,
                  },
                  {
                    path: 'drafts',
                    element: <MenuExplorer statusFilterPreset="draft" />,
                  },
                  {
                    path: 'published',
                    element: <MenuExplorer statusFilterPreset="published" />,
                  },
                  {
                    path: 'archive',
                    element: <MenuExplorer statusFilterPreset="archived" />,
                  },
                  {
                    path: 'categories',
                    element: <CategoryList />,
                  },
                  {
                    path: 'categories/new',
                    element: <CategoryEditor />,
                  },
                  {
                    path: 'categories/:id',
                    element: <CategoryTree />,
                  },
                  {
                    path: 'categories/:id/edit',
                    element: <CategoryEditor />,
                  },
                  {
                    path: 'sections',
                    element: <SectionList />,
                  },
                  {
                    path: 'sections/:id',
                    element: <SectionDetailPanel />,
                  },
                  {
                    path: 'organization',
                    element: <HierarchyPanel />,
                  },
                  {
                    path: 'hierarchy',
                    element: <CategoryTree />,
                  },
                ],
              },
              {
                path: 'inventory',
                element: <InventoryLayout />,
                children: [
                  {
                    index: true,
                    element: <InventoryExplorer />,
                  },
                  {
                    path: 'new',
                    element: <IngredientEditor />,
                  },
                  {
                    path: ':id',
                    element: <IngredientEditor />,
                  },
                  {
                    path: 'low-stock',
                    element: <InventoryExplorer statusFilterPreset="low-stock" />,
                  },
                  {
                    path: 'out-of-stock',
                    element: <InventoryExplorer statusFilterPreset="out-of-stock" />,
                  },
                  {
                    path: 'expiry',
                    element: <InventoryExplorer statusFilterPreset="expiry" />,
                  },
                  {
                    path: 'waste',
                    element: <WasteTracker />,
                  },
                ],
              },
              {
                path: 'staff',
                element: <StaffLayout />,
                children: [
                  {
                    index: true,
                    element: <StaffDirectory />,
                  },
                  {
                    path: 'new',
                    element: <StaffProfileEditor />,
                  },
                  {
                    path: ':id',
                    element: <StaffProfileEditor />,
                  },
                  {
                    path: ':id/edit',
                    element: <StaffProfileEditor />,
                  },
                  {
                    path: 'roles',
                    element: <RoleManager />,
                  },
                  {
                    path: 'shifts',
                    element: <ShiftScheduler />,
                  },
                  {
                    path: 'attendance',
                    element: <AttendanceTracker />,
                  },
                  {
                    path: 'performance',
                    element: <PerformanceHub />,
                  },
                ],
              },
              {
                path: 'analytics',
                element: <AnalyticsLayout />,
                children: [
                  {
                    index: true,
                    element: <AnalyticsOverview />,
                  },
                  {
                    path: 'sales',
                    element: <SalesAnalytics />,
                  },
                  {
                    path: 'menu',
                    element: <MenuAnalytics />,
                  },
                  {
                    path: 'operations',
                    element: <OperationsAnalytics />,
                  },
                  {
                    path: 'inventory',
                    element: <InventoryAnalytics />,
                  },
                  {
                    path: 'staff',
                    element: <StaffAnalytics />,
                  },
                  {
                    path: 'finance',
                    element: <FinanceAnalytics />,
                  },
                  {
                    path: 'branches',
                    element: <BranchAnalytics />,
                  },
                  {
                    path: 'time',
                    element: <TimeAnalytics />,
                  },
                ],
              },
              {
                path: 'finance',
                element: <FinanceLayout />,
                children: [
                  {
                    index: true,
                    element: <FinanceDashboard />,
                  },
                  {
                    path: 'dashboard',
                    element: <FinanceDashboard />,
                  },
                  {
                    path: 'billing',
                    element: <BillingView />,
                  },
                  {
                    path: 'invoices',
                    element: <InvoicesView />,
                  },
                  {
                    path: 'invoices/:id',
                    element: <InvoiceDetailView />,
                  },
                  {
                    path: 'payouts',
                    element: <PayoutsView />,
                  },
                  {
                    path: 'payouts/:id',
                    element: <PayoutDetailView />,
                  },
                  {
                    path: 'taxes',
                    element: <TaxesView />,
                  },
                  {
                    path: 'expenses',
                    element: <ExpensesView />,
                  },
                  {
                    path: 'refunds',
                    element: <RefundsView />,
                  },
                  {
                    path: 'reconciliation',
                    element: <ReconciliationView />,
                  },
                  {
                    path: 'fees',
                    element: <FeesView />,
                  },
                ],
              },
              {
                path: 'promotions',
                element: <PortalPromotionsView />,
              },
              {
                path: 'customers',
                element: <CustomersLayout />,
                children: [
                  {
                    index: true,
                    element: <CustomerTable />,
                  },
                  {
                    path: 'new',
                    element: <CustomerForm />,
                  },
                  {
                    path: ':id/edit',
                    element: <CustomerForm />,
                  },
                  {
                    path: 'segments',
                    element: <CustomerSegments />,
                  },
                  {
                    path: 'retention',
                    element: <CustomerRetention />,
                  },
                  {
                    path: 'notes',
                    element: <CustomerNotes />,
                  },
                  {
                    path: 'communication',
                    element: <CustomerCommunication />,
                  },
                ],
              },
              {
                path: 'settings',
                element: <PortalSettingsView />,
              },
              {
                path: 'profile',
                element: <ProfileLayout />,
                children: [
                  {
                    index: true,
                    element: <RestaurantIdentityTab />,
                  },
                  {
                    path: 'business',
                    element: <BusinessIdentityTab />,
                  },
                  {
                    path: 'location',
                    element: <LocationTab />,
                  },
                  {
                    path: 'operations',
                    element: <OperationsTab />,
                  },
                  {
                    path: 'branding',
                    element: <BrandingTab />,
                  },
                  {
                    path: 'settings',
                    element: <WorkspaceSettingsTab />,
                  },
                  {
                    path: 'preview',
                    element: <LivePreviewTab />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'restaurant/integrations',
    element: <IntegrationsLayout />,
    children: [
      { index: true, element: <IntegrationsDashboard /> },
      { path: 'dashboard', element: <IntegrationsDashboard /> },
      { path: 'apps', element: <AppConnectionsPage /> },
      { path: 'webhooks', element: <WebhooksPage /> },
      { path: 'automations', element: <AutomationsPage /> },
      { path: 'api', element: <ApiCenterPage /> },
      { path: 'sync', element: <SyncHealthPage /> },
      { path: 'logs', element: <IntegrationLogsPage /> },
      { path: 'marketplace', element: <MarketplacePage /> },
      { path: 'settings', element: <IntegrationSettingsPage /> },
    ],
  },
  {
    path: 'restaurant/branches',
    element: <BranchLayout />,
    children: [
      { index: true, element: <BranchOverviewPage /> },
      { path: 'directory', element: <BranchDirectoryPage /> },
      { path: 'new', element: <NewBranchPage /> },
      { path: 'compare', element: <BranchComparisonPage /> },
      { path: 'hours', element: <BranchHoursPage /> },
      { path: 'assignments', element: <BranchAssignmentsPage /> },
      { path: 'zones', element: <DeliveryZonesPage /> },
      { path: 'readiness', element: <BranchReadinessPage /> },
      { path: 'regional', element: <RegionConfigPage /> },
      { path: ':id', element: <BranchDetailPage /> },
      { path: ':id/edit', element: <BranchDetailPage /> },
      { path: ':id/hours', element: <BranchHoursPage /> },
      { path: ':id/staff', element: <BranchAssignmentsPage /> },
      { path: ':id/menu', element: <BranchAssignmentsPage /> },
      { path: ':id/inventory', element: <BranchAssignmentsPage /> },
      { path: ':id/zones', element: <DeliveryZonesPage /> },
      { path: ':id/readiness', element: <BranchReadinessPage /> },
    ],
  },
  {
    path: 'rider/login',
    element: <RiderLoginPage />,
  },
  { path: 'rider/welcome', element: <RiderWelcomePage /> },
  { path: 'rider/register', element: <RiderRegisterPage /> },
  { path: 'rider/otp', element: <RiderOtpPage /> },
  { path: 'rider/email-verification', element: <RiderEmailVerifyPage /> },
  { path: 'rider/identity', element: <RiderIdentityVerifyPage /> },
  { path: 'rider/documents', element: <RiderDocumentsUploadPage /> },
  { path: 'rider/vehicle', element: <RiderVehicleVerifyPage /> },
  { path: 'rider/account-review', element: <RiderAccountReviewPage /> },
  { path: 'rider/account-approved', element: <RiderAccountApprovedPage /> },
  { path: 'rider/forgot-password', element: <RiderForgotPasswordPage /> },
  { path: 'rider/reset-password', element: <RiderResetPasswordPage /> },
  {
    path: 'rider',
    element: <RiderAppShell />,
    children: [
      { index: true, element: <RiderDashboardHomePage /> },
      {
        path: 'dashboard',
        element: <RiderDashboardLayout />,
        children: [
          { index: true, element: <RiderDashboardHomePage /> },
          { path: 'home', element: <RiderDashboardHomePage /> },
          { path: 'today', element: <RiderDashboardTodayPage /> },
          { path: 'alerts', element: <RiderDashboardAlertsPage /> },
          { path: 'summary', element: <RiderDashboardSummaryPage /> },
          { path: 'overview', element: <RiderDashboardOverviewPage /> },
        ],
      },
      { path: 'home', element: <RiderDashboardHomePage /> },
      { path: 'today', element: <RiderDashboardTodayPage /> },
      { path: 'alerts', element: <RiderDashboardAlertsPage /> },
      { path: 'summary', element: <RiderDashboardSummaryPage /> },
      {
        path: 'orders',
        element: <RiderOrdersLayout />,
        children: [
          { index: true, element: <RiderOrdersAvailablePage /> },
          { path: 'available', element: <RiderOrdersAvailablePage /> },
          { path: 'priority', element: <RiderOrdersPriorityPage /> },
          { path: 'scheduled', element: <RiderOrdersScheduledPage /> },
          { path: 'assigned', element: <RiderOrdersAssignedPage /> },
          { path: 'history', element: <RiderOrdersHistoryPage /> },
          { path: ':id', element: <RiderOrderDetailPage /> },
          { path: ':id/details', element: <RiderOrderDetailPage /> },
          { path: ':id/offer', element: <RiderOrderDetailPage /> },
        ],
      },
      {
        path: 'active',
        element: <RiderActiveLayout />,
        children: [
          { index: true, element: <RiderActiveHomePage /> },
          { path: 'current', element: <RiderActiveHomePage /> },
          { path: 'pickup', element: <RiderActivePickupPage /> },
          { path: 'delivery', element: <RiderActiveDeliveryPage /> },
          { path: 'route', element: <RiderActiveRoutePage /> },
          { path: 'status', element: <RiderActiveStatusPage /> },
          { path: 'exceptions', element: <RiderActiveExceptionsPage /> },
          { path: ':id', element: <RiderActiveDetailPage /> },
        ],
      },
      {
        path: 'navigation',
        element: <RiderNavigationLayout />,
        children: [
          { index: true, element: <RiderNavigationLivePage /> },
          { path: 'live', element: <RiderNavigationLivePage /> },
          { path: 'route', element: <RiderNavigationRoutePage /> },
          { path: 'map', element: <RiderNavigationMapPage /> },
          { path: 'eta', element: <RiderNavigationETAPage /> },
          { path: 'alerts', element: <RiderNavigationAlertsPage /> },
          { path: ':id', element: <RiderNavigationDetailPage /> },
        ],
      },
      {
        path: 'earnings',
        element: <RiderEarningsLayout />,
        children: [
          { index: true, element: <RiderEarningsTodayPage /> },
          { path: 'today', element: <RiderEarningsTodayPage /> },
          { path: 'weekly', element: <RiderEarningsWeeklyPage /> },
          { path: 'monthly', element: <RiderEarningsMonthlyPage /> },
          { path: 'breakdown', element: <RiderEarningsBreakdownPage /> },
          { path: 'wallet', element: <RiderEarningsWalletPage /> },
          { path: 'payouts', element: <RiderEarningsPayoutsPage /> },
          { path: 'bonuses', element: <RiderEarningsBonusesPage /> },
          { path: 'deductions', element: <RiderEarningsDeductionsPage /> },
          { path: 'statements', element: <RiderEarningsStatementsPage /> },
        ],
      },
      { path: 'payouts', element: <RiderEarningsPayoutsPage /> },
      { path: 'wallet', element: <RiderEarningsWalletPage /> },
      { path: 'breakdown', element: <RiderEarningsBreakdownPage /> },
      { path: 'weekly', element: <RiderEarningsWeeklyPage /> },
      { path: 'monthly', element: <RiderEarningsMonthlyPage /> },
      { path: 'bonuses', element: <RiderEarningsBonusesPage /> },
      { path: 'deductions', element: <RiderEarningsDeductionsPage /> },
      { path: 'statements', element: <RiderEarningsStatementsPage /> },
      { path: 'history', element: <RiderHistoryPage /> },
      { path: 'notifications', element: <RiderNotificationsPage /> },
      { path: 'support', element: <RiderSupportPage /> },
      {
        path: 'profile',
        element: <RiderProfileLayout />,
        children: [
          { index: true, element: <RiderProfileOverviewPage /> },
          { path: 'edit', element: <RiderProfileEditPage /> },
          { path: 'contact', element: <RiderProfileContactPage /> },
          { path: 'vehicle', element: <RiderProfileVehiclePage /> },
          { path: 'documents', element: <RiderProfileDocumentsPage /> },
          { path: 'availability', element: <RiderProfileAvailabilityPage /> },
          { path: 'service-area', element: <RiderProfileServiceAreaPage /> },
          { path: 'preferences', element: <RiderProfilePreferencesPage /> },
          { path: 'payout', element: <RiderProfilePayoutPage /> },
          { path: 'readiness', element: <RiderProfileReadinessPage /> },
        ],
      },
      { path: 'vehicle', element: <RiderProfileVehiclePage /> },
      { path: 'documents', element: <RiderProfileDocumentsPage /> },
      { path: 'settings', element: <RiderSettingsPage /> },
    ],
  },
  {
    path: 'restaurant/quality',
    element: <QualityLayout />,
    children: [
      { index: true, element: <QualityOverview /> },
      { path: 'overview', element: <QualityOverview /> },
      { path: 'test-suites', element: <TestSuites /> },
      { path: 'workflows', element: <WorkflowCoverage /> },
      { path: 'accessibility', element: <AccessibilityAudit /> },
      { path: 'performance', element: <PerformanceBudget /> },
      { path: 'responsiveness', element: <ResponsivenessMatrix /> },
      { path: 'regressions', element: <RegressionCoverage /> },
      { path: 'browser-matrix', element: <BrowserMatrix /> },
      { path: 'release-confidence', element: <ReleaseConfidence /> },
      { path: 'error-recovery', element: <ErrorRecovery /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
