import { cloneElement, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Grid } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  CreditCardOutlined,
  AppstoreOutlined,
  BuildOutlined,
  RobotOutlined,
  BarChartOutlined,
  AuditOutlined,
  SettingOutlined,
  CloseOutlined,
  MenuOutlined,
  LogoutOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import CustomModal from "../CustomModal/CustomModal";
import { getSessionUser, clearSession } from "../../services/auth";
import "./AdminLayout.scss";

const { useBreakpoint } = Grid;

const ADMIN_MENUS = [
  { key: "dashboard", text: "Dashboard", icon: <DashboardOutlined />, path: "/admin/dashboard" },
  { key: "users", text: "Users", icon: <TeamOutlined />, path: "/admin/users" },
  { key: "subscriptions", text: "Subscriptions", icon: <CreditCardOutlined />, path: "/admin/subscriptions" },
  { key: "invoices", text: "Invoices", icon: <FileTextOutlined />, path: "/admin/invoices" },
  { key: "industries", text: "Industries", icon: <BuildOutlined />, path: "/admin/industries" },
  { key: "tools", text: "AI Tools", icon: <AppstoreOutlined />, path: "/admin/tools" },
  { key: "ai-providers", text: "AI Providers", icon: <RobotOutlined />, path: "/admin/ai-providers" },
  { key: "analytics", text: "Analytics", icon: <BarChartOutlined />, path: "/admin/analytics" },
  { key: "audit-logs", text: "Audit Logs", icon: <AuditOutlined />, path: "/admin/audit-logs" },
  { key: "settings", text: "Settings", icon: <SettingOutlined />, path: "/admin/settings" },
];

const AdminLayout = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const screens = useBreakpoint();
  const isPhone = !screens.md;
  const location = useLocation();
  const navigate = useNavigate();
  const userData = getSessionUser();

  useEffect(() => {
    if (!isPhone) return;
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileNavOpen, isPhone]);

  const confirmLogout = () => {
    clearSession();
    setShowLogoutModal(false);
    navigate("/login");
  };

  const renderMenuList = () => (
    <ul className="admin-sidebar__menu">
      {ADMIN_MENUS.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        const coloredIcon = cloneElement(item.icon, {
          style: { color: isActive ? "#ffffff" : "#94a3b8", fontSize: "16px" },
        });
        return (
          <li key={item.key}>
            <button
              type="button"
              className={`admin-sidebar__menu-btn ${isActive ? "is-active" : ""}`}
              onClick={() => {
                navigate(item.path);
                if (isPhone) setMobileNavOpen(false);
              }}
            >
              <span className="admin-sidebar__menu-icon">{coloredIcon}</span>
              <span className="admin-sidebar__menu-label">{item.text}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  const SidebarContent = () => (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__top">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__brand-icon">⚡</span>
          <div>
            <div className="admin-sidebar__brand-name">Zynapse</div>
            <div className="admin-sidebar__brand-sub">Admin Portal</div>
          </div>
        </div>
        {isPhone && (
          <button
            className="admin-sidebar__toggle"
            onClick={() => setMobileNavOpen(false)}
            type="button"
          >
            <CloseOutlined />
          </button>
        )}
      </div>

      <nav className="admin-sidebar__center">{renderMenuList()}</nav>

      <div className="admin-sidebar__bottom">
        <div className="admin-sidebar__user">
          <div className="admin-sidebar__user-avatar">
            {(userData?.name || "A").charAt(0).toUpperCase()}
          </div>
          <div className="admin-sidebar__user-info">
            <span className="admin-sidebar__user-name">{userData?.name || "Admin"}</span>
            <span className="admin-sidebar__user-role">{userData?.role || "ADMIN"}</span>
          </div>
        </div>
        <button
          type="button"
          className="admin-sidebar__logout"
          onClick={() => setShowLogoutModal(true)}
          aria-label="Logout"
        >
          <LogoutOutlined />
        </button>
      </div>
    </aside>
  );

  return (
    <div className="admin-layout">
      {!isPhone && <SidebarContent />}

      {isPhone && (
        <>
          <div
            className={`sidebar-backdrop ${mobileNavOpen ? "open" : ""}`}
            onClick={() => setMobileNavOpen(false)}
          />
          <div className={`admin-sidebar-drawer ${mobileNavOpen ? "open" : ""}`}>
            <SidebarContent />
          </div>
        </>
      )}

      <div className="admin-layout__right">
        <header className="admin-layout__header">
          <div className="admin-header__left">
            {isPhone && (
              <button
                className="admin-header__navbtn"
                type="button"
                onClick={() => setMobileNavOpen(true)}
              >
                <MenuOutlined />
              </button>
            )}
            <div className="admin-header__page-title">
              {ADMIN_MENUS.find((m) => location.pathname.startsWith(m.path))?.text || "Admin"}
            </div>
          </div>
          <div className="admin-header__right">
            <span className="admin-header__role-badge">
              {userData?.role || "ADMIN"}
            </span>
          </div>
        </header>

        <main className="admin-layout__content">
          <Outlet />
        </main>
      </div>

      <CustomModal
        open={showLogoutModal}
        title="Confirm Logout"
        onClose={() => setShowLogoutModal(false)}
        primaryText="Logout"
        dangerText="Cancel"
        onPrimary={confirmLogout}
        primaryProps={{ variant: "danger" }}
      >
        <p style={{ margin: 0, color: "#64748b" }}>
          Are you sure you want to logout from the admin portal?
        </p>
      </CustomModal>
    </div>
  );
};

export default AdminLayout;
