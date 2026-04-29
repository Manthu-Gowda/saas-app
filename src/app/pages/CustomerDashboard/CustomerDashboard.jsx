import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubHeader from "../../components/SubHeader/SubHeader";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { getSessionUser } from "../../services/auth";
import axiosInstance from "../../services/axiosInstance";
import { GET_DASHBOARD } from "../../utils/apiPath";
import { errorToast } from "../../services/ToastHelper";
import "./CustomerDashboard.scss";
import { ArrowRightOutlined, RobotOutlined, ClockCircleOutlined, FireOutlined } from "@ant-design/icons";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const user = getSessionUser();
  const [stats, setStats] = useState({ runsUsed: 0, runsTotal: 10, recentActivity: [], planTier: "FREE" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axiosInstance.get(GET_DASHBOARD);
        setStats(data);
      } catch (error) {
        errorToast("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const runsPercentage = stats.runsTotal > 0
    ? Math.min((stats.runsUsed / stats.runsTotal) * 100, 100)
    : 0;

  const getProgressColor = () => {
    if (runsPercentage >= 90) return "#ef4444";
    if (runsPercentage >= 70) return "#f59e0b";
    return "#6c47ff";
  };

  return (
    <div className="customer-dashboard">
      <SubHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "User"}!`}
        subTitle="Here is an overview of your AI usage and recent activity."
        showBack={false}
      />

      <div className="dashboard-grid">
        {/* Usage Card */}
        <div className="dash-card usage-card">
          <div className="dash-card__header">
            <h3>AI Runs Usage</h3>
            <span className="dash-card__badge">{stats.planTier || user?.planTier || "FREE"}</span>
          </div>
          <div className="usage-stats">
            <div className="usage-numbers">
              <span className="usage-current">{stats.runsUsed}</span>
              <span className="usage-divider">/</span>
              <span className="usage-total">{stats.runsTotal === -1 ? "∞" : stats.runsTotal}</span>
            </div>
            <p className="usage-label">Runs used this billing cycle</p>
          </div>
          {stats.runsTotal !== -1 && (
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${runsPercentage}%`, backgroundColor: getProgressColor() }}
              />
            </div>
          )}
          {runsPercentage > 80 && stats.runsTotal !== -1 && (
            <p className="usage-warning">
              <FireOutlined /> You are nearing your limit.{" "}
              <button onClick={() => navigate("/billing")} className="link-btn">Upgrade plan</button>
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="dash-card">
          <div className="dash-card__header">
            <h3>Quick Actions</h3>
          </div>
          <div className="action-buttons">
            <ButtonComponent
              variant="outline"
              icon={<RobotOutlined />}
              onClick={() => navigate("/tools")}
              className="action-btn"
            >
              Browse AI Tools
            </ButtonComponent>
            <ButtonComponent
              variant="outline"
              icon={<ClockCircleOutlined />}
              onClick={() => navigate("/history")}
              className="action-btn"
            >
              View History
            </ButtonComponent>
          </div>
          {stats.industry && (
            <div className="industry-badge">
              <span>{stats.industry.icon}</span>
              <span>{stats.industry.name} Tools Active</span>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="dash-card activity-card">
          <div className="dash-card__header">
            <h3>Recent Activity</h3>
            <button className="view-all-btn" onClick={() => navigate("/history")}>
              View All <ArrowRightOutlined />
            </button>
          </div>
          <div className="activity-list">
            {loading ? (
              <p className="empty-text">Loading...</p>
            ) : stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity) => (
                <div key={activity._id} className="activity-item">
                  <div className="activity-icon">
                    {activity.toolId?.icon || <RobotOutlined />}
                  </div>
                  <div className="activity-details">
                    <h4>{activity.toolId?.name || "Tool Run"}</h4>
                    <p>{new Date(activity.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <span className={`activity-status ${activity.status}`}>{activity.status}</span>
                </div>
              ))
            ) : (
              <div className="empty-activity">
                <RobotOutlined style={{ fontSize: "32px", color: "#cbd5e1" }} />
                <p>No recent activity. <button onClick={() => navigate("/tools")} className="link-btn">Run your first tool!</button></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
