import { useState, useEffect } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import axiosInstance from "../../services/axiosInstance";
import { ADMIN_DASHBOARD_STATS } from "../../utils/apiPath";
import { errorToast } from "../../services/ToastHelper";
import {
  TeamOutlined, RobotOutlined, DollarCircleOutlined, RiseOutlined,
  CheckCircleOutlined, StopOutlined,
} from "@ant-design/icons";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import "./AdminDashboard.scss";

const PLAN_COLORS = { FREE: "#94a3b8", STARTER: "#3b82f6", PRO: "#6c47ff", BUSINESS: "#10b981" };

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axiosInstance.get(ADMIN_DASHBOARD_STATS);
        setStats(data);
      } catch {
        errorToast("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const planData = (stats?.planCounts || []).map((p) => ({
    name: p._id,
    value: p.count,
    color: PLAN_COLORS[p._id] || "#94a3b8",
  }));

  const signupData = (stats?.signupTrend || []).map((d) => ({
    date: d._id?.slice(5),
    signups: d.count,
  }));

  const topToolsData = (stats?.topTools || []).map((t) => ({
    name: t.name?.length > 18 ? t.name.slice(0, 18) + "…" : t.name,
    runs: t.count,
  }));

  return (
    <div className="admin-dashboard-page">
      <SubHeader
        title="Platform Overview"
        subTitle="High-level metrics for Zynapse platform."
        showBack={false}
      />

      {/* Stat Cards */}
      <div className="admin-stats-grid">
        <StatCard
          title="Total Customers"
          value={loading ? "..." : stats?.totalUsers ?? 0}
          icon={<TeamOutlined />}
          color="#3b82f6"
          bg="#dbeafe"
          sub="All registered customers"
        />
        <StatCard
          title="Active Users"
          value={loading ? "..." : stats?.activeUsers ?? 0}
          icon={<CheckCircleOutlined />}
          color="#10b981"
          bg="#d1fae5"
          sub="Currently active accounts"
        />
        <StatCard
          title="AI Runs Today"
          value={loading ? "..." : stats?.aiRunsToday ?? 0}
          icon={<RobotOutlined />}
          color="#6c47ff"
          bg="#ede8ff"
          sub={`${stats?.totalAiRuns ?? 0} total all time`}
        />
        <StatCard
          title="Suspended"
          value={loading ? "..." : stats?.suspendedUsers ?? 0}
          icon={<StopOutlined />}
          color="#ef4444"
          bg="#fee2e2"
          sub="Accounts suspended"
        />
      </div>

      {/* Charts */}
      <div className="admin-charts-section">
        <div className="chart-container">
          <h3>Signups — Last 7 Days</h3>
          {signupData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={signupData} margin={{ top: 8, right: 16, bottom: 0, left: -10 }}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="signups" fill="#6c47ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">No signup data yet</div>
          )}
        </div>

        <div className="chart-container">
          <h3>Users by Plan</h3>
          {planData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={planData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {planData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">No plan data yet</div>
          )}
        </div>

        <div className="chart-container chart-container--wide">
          <h3>Top 5 Most-Used Tools</h3>
          {topToolsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topToolsData} layout="vertical" margin={{ top: 8, right: 32, bottom: 0, left: 80 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="runs" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">No tool usage data yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, bg, sub }) => (
  <div className="admin-stat-card">
    <div className="stat-header">
      <span className="stat-title">{title}</span>
      <div className="stat-icon" style={{ color, background: bg }}>{icon}</div>
    </div>
    <div className="stat-value">{value}</div>
    <div className="stat-footer">{sub}</div>
  </div>
);

export default AdminDashboard;
