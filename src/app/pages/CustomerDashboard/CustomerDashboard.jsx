import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubHeader from "../../components/SubHeader/SubHeader";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { getSessionUser } from "../../services/auth";
import "./CustomerDashboard.scss";
import { ArrowRightOutlined, RobotOutlined, ClockCircleOutlined } from "@ant-design/icons";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const user = getSessionUser();
  const [stats, setStats] = useState({ runsUsed: 0, runsTotal: 10, recentActivity: [] });
  
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axiosInstance.get(GET_DASHBOARD);
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard", error);
      }
    };
    fetchDashboard();
  }, []);

  const runsPercentage = Math.min((stats.runsUsed / stats.runsTotal) * 100, 100) || 0;

  return (
    <div className="customer-dashboard">
      <SubHeader 
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}!`} 
        subTitle="Here is an overview of your AI usage and tools."
        showBack={false}
      />

      <div className="dashboard-grid">
        {/* Usage Card */}
        <div className="dash-card usage-card">
          <div className="dash-card__header">
            <h3>AI Runs Usage</h3>
            <span className="dash-card__badge">{stats.planTier || user?.planTier || "FREE"} Plan</span>
          </div>
          <div className="usage-stats">
            <div className="usage-numbers">
              <span className="usage-current">{stats.runsUsed}</span>
              <span className="usage-divider">/</span>
              <span className="usage-total">{stats.runsTotal}</span>
            </div>
            <p className="usage-label">Runs used this billing cycle</p>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${runsPercentage}%` }} />
          </div>
          {runsPercentage > 80 && (
            <p className="usage-warning">You are nearing your limit. <a href="/billing">Upgrade plan</a></p>
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
        </div>

        {/* Recent Activity */}
        <div className="dash-card activity-card">
          <div className="dash-card__header">
            <h3>Recent Activity</h3>
            <button className="view-all-btn" onClick={() => navigate("/history")}>View All <ArrowRightOutlined /></button>
          </div>
          <div className="activity-list">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity) => (
                <div key={activity._id} className="activity-item">
                  <div className="activity-icon"><RobotOutlined /></div>
                  <div className="activity-details">
                    <h4>{activity.toolId?.name || "Tool Run"}</h4>
                    <p>{new Date(activity.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
