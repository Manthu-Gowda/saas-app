// ─── Auth ─────────────────────────────────────────────────────────────────────
export const LOGIN = "auth/Login";
export const REGISTER = "auth/Register";
export const FORGOT_PASSWORD = "auth/ForgotPassword";

// ─── User Profile & Onboarding ────────────────────────────────────────────────
export const SET_INDUSTRY = "user/SetIndustry";
export const GET_INDUSTRIES = "user/GetIndustries";
export const GET_DASHBOARD = "user/GetDashboard";
export const GET_HISTORY = "user/GetHistory";
export const GET_PROFILE = "user/Profile";
export const UPDATE_PROFILE = "user/Profile";
export const CHANGE_PASSWORD = "user/ChangePassword";

// ─── Tools ────────────────────────────────────────────────────────────────────
export const GET_MY_TOOLS = "tools/GetTools";
export const GET_TOOL_BY_SLUG = "tools"; // appends /:slug dynamically
export const EXTRACT_PDF = "tools/ExtractPdf";
export const RUN_AI_TOOL = "tools/RunTool";

// ─── Admin — Dashboard ────────────────────────────────────────────────────────
export const ADMIN_DASHBOARD_STATS = "admin/GetDashboardStats";
export const ADMIN_ANALYTICS = "admin/analytics";

// ─── Admin — Users ────────────────────────────────────────────────────────────
export const ADMIN_GET_USERS = "admin/users";
export const ADMIN_GET_USER = (id) => `admin/users/${id}`;
export const ADMIN_UPDATE_USER = (id) => `admin/users/${id}`;
export const ADMIN_SUSPEND_USER = (id) => `admin/users/${id}/suspend`;
export const ADMIN_ACTIVATE_USER = (id) => `admin/users/${id}/activate`;
export const ADMIN_RESET_RUNS = (id) => `admin/users/${id}/reset-runs`;
export const ADMIN_CHANGE_PLAN = (id) => `admin/users/${id}/change-plan`;
export const ADMIN_DELETE_USER = (id) => `admin/users/${id}`;

// ─── Admin — Tools ────────────────────────────────────────────────────────────
export const ADMIN_GET_TOOLS = "admin/tools";
export const ADMIN_GET_TOOL = (id) => `admin/tools/${id}`;
export const ADMIN_CREATE_TOOL = "admin/tools";
export const ADMIN_UPDATE_TOOL = (id) => `admin/tools/${id}`;
export const ADMIN_DELETE_TOOL = (id) => `admin/tools/${id}`;

// ─── Admin — Industries ───────────────────────────────────────────────────────
export const ADMIN_GET_INDUSTRIES = "admin/industries";
export const ADMIN_CREATE_INDUSTRY = "admin/industries";
export const ADMIN_UPDATE_INDUSTRY = (id) => `admin/industries/${id}`;
export const ADMIN_DELETE_INDUSTRY = (id) => `admin/industries/${id}`;

// ─── Admin — AI Providers ─────────────────────────────────────────────────────
export const ADMIN_GET_PROVIDERS = "admin/ai-providers";
export const ADMIN_CREATE_PROVIDER = "admin/ai-providers";
export const ADMIN_UPDATE_PROVIDER = (id) => `admin/ai-providers/${id}`;
export const ADMIN_DELETE_PROVIDER = (id) => `admin/ai-providers/${id}`;
export const ADMIN_TEST_PROVIDER = (id) => `admin/ai-providers/${id}/test`;

// ─── Admin — Subscriptions & Audit Logs ──────────────────────────────────────
export const ADMIN_GET_SUBSCRIPTIONS = "admin/subscriptions";
export const ADMIN_GET_AUDIT_LOGS = "admin/audit-logs";
