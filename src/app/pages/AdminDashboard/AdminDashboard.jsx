import { useState, useEffect } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import { TeamOutlined, RobotOutlined, DollarCircleOutlined, RiseOutlined } from "@ant-design/icons";
import "./AdminDashboard.scss";

// Dummy Chart Component placeholder
const MiniChart = ({ data, color }) => (
  <div className="mini-chart">
    <div className="mini-chart__bars">
      {data.map((h, i) => (
        <div key={i} className="bar" style={{ height: `${h}%`, backgroundColor: color }} />
      ))}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalUsers: "12,450",
        activeSubs: "8,200",
        mrr: "$245,500",
        aiRuns: "1.2M",
        userGrowth: [30, 40, 45, 60, 75, 80, 100],
        mrrGrowth: [40, 45, 55, 65, 80, 90, 100],
      });
    }, 500);
  }, []);

  return (
    <div className="admin-dashboard-page">
      <SubHeader 
        title="Platform Overview" 
        subTitle="High-level metrics for Zynapse platform."
        showBack={false}
      />

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Users</span>
            <div className="stat-icon" style={{ color: "#3b82f6", background: "#dbeafe" }}>
              <TeamOutlined />
            </div>
          </div>
          <div className="stat-value">{stats?.totalUsers || "..."}</div>
          <div className="stat-footer">
            <span className="trend positive"><RiseOutlined /> +12%</span> this month
          </div>
          {stats && <MiniChart data={stats.userGrowth} color="#3b82f6" />}
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <span className="stat-title">Monthly Recurring Rev</span>
            <div className="stat-icon" style={{ color: "#10b981", background: "#d1fae5" }}>
              <DollarCircleOutlined />
            </div>
          </div>
          <div className="stat-value">{stats?.mrr || "..."}</div>
          <div className="stat-footer">
            <span className="trend positive"><RiseOutlined /> +8%</span> this month
          </div>
          {stats && <MiniChart data={stats.mrrGrowth} color="#10b981" />}
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <span className="stat-title">Active Subscriptions</span>
            <div className="stat-icon" style={{ color: "#6c47ff", background: "#ede8ff" }}>
              <TeamOutlined />
            </div>
          </div>
          <div className="stat-value">{stats?.activeSubs || "..."}</div>
          <div className="stat-footer">
            <span className="trend positive"><RiseOutlined /> +5%</span> this month
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <span className="stat-title">AI Tool Executions</span>
            <div className="stat-icon" style={{ color: "#f59e0b", background: "#fef3c7" }}>
              <RobotOutlined />
            </div>
          </div>
          <div className="stat-value">{stats?.aiRuns || "..."}</div>
          <div className="stat-footer">
            <span className="trend positive"><RiseOutlined /> +22%</span> this month
          </div>
        </div>
      </div>

      <div className="admin-charts-section">
        {/* Placeholders for actual Recharts */}
        <div className="chart-container">
          <h3>User Growth</h3>
          <div className="chart-placeholder">Chart Area</div>
        </div>
        <div className="chart-container">
          <h3>Revenue by Industry</h3>
          <div className="chart-placeholder">Chart Area</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
