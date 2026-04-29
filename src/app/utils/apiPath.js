// ─── Auth ──────────────────────────────────────────────
export const LOGIN = "auth/Login";
export const REGISTER = "auth/Register";

// ─── User Profile & Onboarding ────────────────────────────────
export const SET_INDUSTRY = "user/SetIndustry";
export const GET_INDUSTRIES = "user/GetIndustries";
export const GET_DASHBOARD = "user/GetDashboard";
export const GET_HISTORY = "user/GetHistory";

// ─── Tools ────────────────────────────────────────────────────
export const GET_MY_TOOLS = "tools/GetTools";
export const GET_TOOL_BY_SLUG = "tools"; // appends /:slug dynamically
export const EXTRACT_PDF = "tools/ExtractPdf";
export const RUN_AI_TOOL = "tools/RunTool";

// ─── Admin ─────────────────────────────────────────────
export const ADMIN_GET_USERS = "admin/GetAllUsers";
export const ADMIN_DASHBOARD_STATS = "admin/GetDashboardStats";

