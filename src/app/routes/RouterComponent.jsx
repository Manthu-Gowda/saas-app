import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import CustomerLayout from "../components/CustomerLayout/CustomerLayout";
import AdminLayout from "../components/AdminLayout/AdminLayout";

// Public Pages
import LandingPage from "../pages/LandingPage/LandingPage";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";

// Customer Pages
import CustomerDashboard from "../pages/CustomerDashboard/CustomerDashboard";
import Onboarding from "../pages/Onboarding/Onboarding";
import ToolsList from "../pages/ToolsList/ToolsList";
import ToolRunner from "../pages/ToolRunner/ToolRunner";
import History from "../pages/History/History";
import Billing from "../pages/Billing/Billing";
import CustomerSettings from "../pages/CustomerSettings/CustomerSettings";

// Admin Pages
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import AdminUsers from "../pages/AdminUsers/AdminUsers";
import AdminUserDetail from "../pages/AdminUserDetail/AdminUserDetail";
import AdminSubscriptions from "../pages/AdminSubscriptions/AdminSubscriptions";
import AdminInvoices from "../pages/AdminInvoices/AdminInvoices";
import AdminIndustries from "../pages/AdminIndustries/AdminIndustries";
import AdminTools from "../pages/AdminTools/AdminTools";
import AdminToolDetail from "../pages/AdminToolDetail/AdminToolDetail";
import AdminAiProviders from "../pages/AdminAiProviders/AdminAiProviders";
import AdminAnalytics from "../pages/AdminAnalytics/AdminAnalytics";
import AdminAuditLogs from "../pages/AdminAuditLogs/AdminAuditLogs";
import AdminSettings from "../pages/AdminSettings/AdminSettings";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

const RouterComponent = () => (
  <BrowserRouter>
    <Routes>
      {/* ─── Public Routes ────────────────────────────────── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ─── Customer Routes ──────────────────────────────── */}
      <Route
        element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/tools" element={<ToolsList />} />
        <Route path="/tools/:toolSlug" element={<ToolRunner />} />
        <Route path="/history" element={<History />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/settings" element={<CustomerSettings />} />
      </Route>

      {/* ─── Admin Routes ─────────────────────────────────── */}
      <Route
        element={
          <ProtectedRoute roles={ADMIN_ROLES}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/users/:userId" element={<AdminUserDetail />} />
        <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
        <Route path="/admin/invoices" element={<AdminInvoices />} />
        <Route path="/admin/industries" element={<AdminIndustries />} />
        <Route path="/admin/tools" element={<AdminTools />} />
        <Route path="/admin/tools/:toolId" element={<AdminToolDetail />} />
        <Route path="/admin/ai-providers" element={<AdminAiProviders />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      {/* ─── Fallback ─────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default RouterComponent;
