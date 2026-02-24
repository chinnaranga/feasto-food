import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import RequireAuth from "./components/RequireAuth";
import NetworkGuard from "./components/NetworkGuard";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import ErrorBoundary from "./components/ErrorBoundary";
import { initMonitoring } from "./utils/monitoring";
import PageLoader from "./components/PageLoader";
import PageTransition from "./components/PageTransition";
import toast from "react-hot-toast";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { AppProvider } from "./context/AppContext";
import { LandingProvider } from "./context/LandingContext";
import { WalletProvider } from "./context/WalletContext";
import { TasteProvider } from "./context/TasteContext";

import Layout from "./components/Layout";
import CommandPalette from "./components/CommandPalette/CommandPalette";
import AiChat from "./components/AiChat";

// Pages
const MaintenancePage = lazy(() => import("./pages/MaintenancePage"));
const AdminRoute = lazy(() => import("./routes/AdminRoute"));
const MaintenanceGuard = lazy(() => import("./components/MaintenanceGuard"));
const AdminMaintenanceBanner = lazy(() => import("./components/AdminMaintenanceBanner"));
const MaintenanceBadge = lazy(() => import("./components/MaintenanceBadge"));

// Lazy-loaded pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));
const PaymentsPage = lazy(() => import("./pages/PaymentsPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminTraffic = lazy(() => import("./pages/admin/AdminTraffic"));
const AdminAlerts = lazy(() => import("./pages/admin/AdminAlerts"));
const AdminRiders = lazy(() => import("./pages/admin/AdminRiders"));
const ManageAddressesPage = lazy(() => import("./pages/ManageAddressesPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const RestaurantsPage = lazy(() => import("./pages/RestaurantsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./pages/PaymentCancel"));
const PremiumPage = lazy(() => import("./pages/PremiumPage"));
const ChefPage = lazy(() => import("./pages/ChefPage"));
const ChefProfilePage = lazy(() => import("./pages/ChefProfilePage"));
const SeedData = lazy(() => import("./pages/SeedData"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));

const AdminTools = lazy(() => import("./pages/AdminTools"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));

const RestaurantLogin = lazy(() => import("./pages/RestaurantLogin"));
const RestaurantDashboard = lazy(() => import("./pages/RestaurantDashboard"));
const RestaurantDetailsPage = lazy(() => import("./pages/RestaurantDetailsPage"));
import RestaurantGuard from "./guards/RestaurantGuard";

// Rider App
const RiderLayout = lazy(() => import("./riders/RiderLayout"));
const RiderLoginPage = lazy(() => import("./riders/pages/RiderLoginPage"));
const RiderDashboard = lazy(() => import("./riders/pages/RiderDashboard"));
const ActiveDeliveryPage = lazy(() => import("./riders/pages/ActiveDeliveryPage"));
const RiderWallet = lazy(() => import("./riders/pages/RiderWallet"));
const RiderMap = lazy(() => import("./riders/pages/RiderMap"));
const RiderEarnings = lazy(() => import("./riders/pages/RiderEarnings"));
const RiderProfile = lazy(() => import("./riders/pages/RiderProfile"));
const CustomerOrderTracking = lazy(() => import("./riders/pages/CustomerOrderTracking"));
import RequireRiderAuth from "./riders/components/RequireRiderAuth";

// Initialize observability
initMonitoring();

// Inner App component to handle routing logic after providers are set up
function AppContent() {
  const location = useLocation();
  const isOnline = useNetworkStatus();
  const [wasOffline, setWasOffline] = useState(false);

  // Avoid toast spam on initial load: only show "back online" if we were offline first
  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    }
    if (isOnline && wasOffline) {
      toast.success("You're back online ✅");
      setWasOffline(false);
    }
  }, [isOnline, wasOffline]);

  return (
    <NetworkGuard>
      <Suspense fallback={<PageLoader />}>
        <MaintenanceGuard>
          <MaintenanceBadge />
          <AdminMaintenanceBanner />
          <CommandPalette />

          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>

                {/* Public Routes */}
                <Route path="/" element={
                  <PageTransition>
                    <LandingPage />
                  </PageTransition>
                } />
                <Route path="/login" element={
                  <PageTransition>
                    <LoginPage />
                  </PageTransition>
                } />
                <Route path="/signup" element={
                  <PageTransition>
                    <SignupPage />
                  </PageTransition>
                } />
                <Route path="/forgot-password" element={
                  <PageTransition>
                    <ForgotPassword />
                  </PageTransition>
                } />
                <Route path="/reset-password" element={
                  <PageTransition>
                    <ResetPassword />
                  </PageTransition>
                } />
                <Route path="/terms" element={
                  <PageTransition>
                    <TermsPage />
                  </PageTransition>
                } />

                {/* Public Discovery Pages */}
                <Route path="/restaurants" element={
                  <PageTransition>
                    <RestaurantsPage />
                  </PageTransition>
                } />
                <Route path="/products" element={
                  <PageTransition>
                    <ProductsPage />
                  </PageTransition>
                } />
                <Route path="/about" element={
                  <PageTransition>
                    <AboutPage />
                  </PageTransition>
                } />
                <Route path="/chefs" element={
                  <PageTransition>
                    <ChefPage />
                  </PageTransition>
                } />
                <Route path="/chef/:id" element={
                  <PageTransition>
                    <ChefProfilePage />
                  </PageTransition>
                } />
                <Route path="/seed-data" element={<SeedData />} />

                {/* Stripe Payment Callbacks */}
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/cancel" element={<PaymentCancel />} />
                <Route path="/premium" element={<PremiumPage />} />

                {/* 🔐 Authenticated Routes (Protected) 
                  All routes here pass through RequireAuth AND Layout
              */}
                <Route element={<RequireAuth />}>
                  <Route element={<Layout />}>
                    <Route path="/dashboard" element={
                      <PageTransition>
                        <DashboardPage />
                      </PageTransition>
                    } />
                    <Route path="/cart" element={
                      <PageTransition>
                        <CartPage />
                      </PageTransition>
                    } />
                    <Route path="/checkout" element={
                      <PageTransition>
                        <CheckoutPage />
                      </PageTransition>
                    } />
                    <Route path="/payments" element={
                      <PageTransition>
                        <PaymentsPage />
                      </PageTransition>
                    } />
                    <Route path="/orders" element={
                      <PageTransition>
                        <OrdersPage />
                      </PageTransition>
                    } />
                    <Route path="/order/:id" element={
                      <PageTransition>
                        <OrderDetailsPage />
                      </PageTransition>
                    } />
                    <Route path="/manage-addresses" element={
                      <PageTransition>
                        <ManageAddressesPage />
                      </PageTransition>
                    } />
                    <Route path="/profile" element={
                      <PageTransition>
                        <UserProfilePage />
                      </PageTransition>
                    } />
                  </Route>
                </Route>


                {/* ADMIN PORTAL - Separate Layout */}
                {/* User requested DEBUG route */}
                <Route path="/admin-tools" element={<AdminTools />} />

                <Route path="/admin/login" element={
                  <PageTransition>
                    <AdminLogin />
                  </PageTransition>
                } />

                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="traffic" element={<AdminTraffic />} />
                  <Route path="alerts" element={<AdminAlerts />} />
                  <Route path="riders" element={<AdminRiders />} />
                  <Route path="tools" element={<AdminTools />} />
                </Route>

                {/* 👨‍🍳 Restaurant Portal Routes */}
                <Route path="/restaurant/login" element={
                  <PageTransition>
                    <RestaurantLogin />
                  </PageTransition>
                } />

                <Route path="/restaurants/login" element={
                  <PageTransition>
                    <RestaurantLogin />
                  </PageTransition>
                } />

                <Route path="/restaurant/dashboard" element={
                  <RestaurantGuard>
                    <RestaurantDashboard />
                  </RestaurantGuard>
                } />

                <Route path="/restaurant/:id" element={
                  <PageTransition>
                    <RestaurantDetailsPage />
                  </PageTransition>
                } />

                {/* 🛵 Delivery Partner Routes */}
                <Route path="/rider/login" element={
                  <PageTransition>
                    <RiderLoginPage />
                  </PageTransition>
                } />

                <Route path="/rider" element={<RequireRiderAuth />}>
                  <Route element={<RiderLayout />}>
                    <Route path="dashboard" element={
                      <PageTransition>
                        <RiderDashboard />
                      </PageTransition>
                    } />
                    <Route path="active/:id" element={
                      <PageTransition>
                        <ActiveDeliveryPage />
                      </PageTransition>
                    } />
                    <Route path="wallet" element={
                      <PageTransition>
                        <RiderWallet />
                      </PageTransition>
                    } />
                    <Route path="map" element={
                      <PageTransition>
                        <RiderMap />
                      </PageTransition>
                    } />
                    <Route path="earnings" element={
                      <PageTransition>
                        <RiderEarnings />
                      </PageTransition>
                    } />
                    <Route path="profile" element={
                      <PageTransition>
                        <RiderProfile />
                      </PageTransition>
                    } />
                  </Route>
                </Route>

                {/* 📡 Customer Tracking */}
                <Route path="/tracking/:id" element={
                  <PageTransition>
                    <CustomerOrderTracking />
                  </PageTransition>
                } />

              </Routes>
            </AnimatePresence>



          </Suspense>
          <AiChat />
        </MaintenanceGuard>
      </Suspense>
    </NetworkGuard>
  );
}

import { ToastProvider } from "./context/ToastContext";


export default function App() {
  // Preload Critical Routes for Instant Navigation
  // Preload Critical Routes for Instant Navigation
  useEffect(() => {
    // Rely on React Lazy + Vite prefetch
  }, []);

  return (
    <ErrorBoundary>

      <AuthProvider>
        <ToastProvider>
          <AppProvider>
            <CartProvider>
              <OrderProvider>
                <WalletProvider>
                  <TasteProvider>
                    <LandingProvider>
                      <AppContent />
                    </LandingProvider>
                  </TasteProvider>
                </WalletProvider>
              </OrderProvider>
            </CartProvider>
          </AppProvider>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

