import { cloneElement, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Grid } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  HistoryOutlined,
  CreditCardOutlined,
  SettingOutlined,
  CloseOutlined,
  MenuOutlined,
  LogoutOutlined,
  BellOutlined,
  FileTextOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import CustomModal from "../CustomModal/CustomModal";
import { getSessionUser, clearSession } from "../../services/auth";
import "./CustomerLayout.scss";

const { useBreakpoint } = Grid;

const MENUS = [
  { key: "dashboard", text: "Dashboard", icon: <DashboardOutlined />, path: "/dashboard" },
  { key: "tools", text: "AI Tools", icon: <AppstoreOutlined />, path: "/tools" },
  { key: "agents", text: "AI Agents", icon: <RobotOutlined />, path: "/agents" },
  { key: "documents", text: "Documents", icon: <FileTextOutlined />, path: "/documents" },
  { key: "history", text: "History", icon: <HistoryOutlined />, path: "/history" },
  { key: "billing", text: "Billing", icon: <CreditCardOutlined />, path: "/billing" },
  { key: "settings", text: "Settings", icon: <SettingOutlined />, path: "/settings" },
];

const CustomerLayout = () => {
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
    <ul className="sidebar__menu">
      {MENUS.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        const coloredIcon = cloneElement(item.icon, {
          style: { color: isActive ? "#ffffff" : "#94a3b8", fontSize: "18px" },
        });
        return (
          <li key={item.key} className="sidebar__menu-row">
            <button
              type="button"
              className={`sidebar__menu-btn ${isActive ? "is-active" : ""}`}
              onClick={() => {
                navigate(item.path);
                if (isPhone) setMobileNavOpen(false);
              }}
            >
              <span className="sidebar__menu-icon">{coloredIcon}</span>
              <span className="sidebar__menu-label">{item.text}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  const Sidebar = () => (
    <aside className="sidebar" aria-label="Customer navigation">
      <div className="sidebar__top">
        <div className="sidebar__brand">
          <span className="sidebar__brand-icon">⚡</span>
          <span className="sidebar__brand-name">Zynapse</span>
        </div>
        {isPhone && (
          <button className="sidebar__toggle" onClick={() => setMobileNavOpen(false)} type="button">
            <CloseOutlined />
          </button>
        )}
      </div>

      <nav className="sidebar__center">{renderMenuList()}</nav>

      <div className="sidebar__bottom">
        <button
          type="button"
          className="sidebar__logout-btn"
          onClick={() => setShowLogoutModal(true)}
        >
          <LogoutOutlined />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="customer-layout">
      {/* Desktop Sidebar */}
      {!isPhone && <Sidebar />}

      {/* Mobile Drawer */}
      {isPhone && (
        <>
          <div
            className={`sidebar-backdrop ${mobileNavOpen ? "open" : ""}`}
            onClick={() => setMobileNavOpen(false)}
          />
          <div className={`sidebar mobile-drawer ${mobileNavOpen ? "open" : ""}`}>
            <Sidebar />
          </div>
        </>
      )}

      {/* Right Pane */}
      <div className="customer-layout__right">
        <header className="customer-layout__header">
          <div className="header__left">
            {isPhone && (
              <button
                className="header__navbtn"
                type="button"
                onClick={() => setMobileNavOpen(true)}
              >
                <MenuOutlined />
              </button>
            )}
            {isPhone && (
              <div className="sidebar__brand">
                <span className="sidebar__brand-icon">⚡</span>
                <span className="sidebar__brand-name">Zynapse</span>
              </div>
            )}
          </div>
          <div className="header__right">
            <button className="header__notif-btn" type="button" aria-label="Notifications">
              <BellOutlined />
            </button>
            <button className="header__user-btn" type="button">
              <div className="header__user-avatar">
                {(userData?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="header__user-meta">
                <span className="header__user-name">{userData?.name || "User"}</span>
                <span className="header__user-plan">{userData?.planTier || "FREE"} Plan</span>
              </div>
            </button>
          </div>
        </header>

        <main className="customer-layout__content">
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
          Are you sure you want to logout? You'll need to sign in again to continue.
        </p>
      </CustomModal>
    </div>
  );
};

export default CustomerLayout;
