import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SubHeader from "../../components/SubHeader/SubHeader";
import InputField from "../../components/InputField/InputField";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import PlanBadge from "../../components/PlanBadge/PlanBadge";
import { successToast } from "../../services/ToastHelper";
import "./AdminUserDetail.scss";

// Dummy data
const MOCK_USER = {
  id: "1",
  name: "Alice Smith",
  email: "alice@acme.com",
  plan: "PRO",
  status: "active",
  joined: "2026-01-15",
  runsUsed: 450,
  runsTotal: 500,
  industry: "Legal"
};

const AdminUserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Usually fetch user by userId
    setUser(MOCK_USER);
  }, [userId]);

  const handleSuspend = () => {
    setLoading(true);
    setTimeout(() => {
      setUser({ ...user, status: "suspended" });
      successToast("User suspended successfully.");
      setLoading(false);
    }, 800);
  };

  if (!user) return null;

  return (
    <div className="admin-user-detail-page">
      <SubHeader 
        title={`User Details: ${user.name}`} 
        subTitle={user.email}
        onBack={() => navigate("/admin/users")}
      />

      <div className="detail-grid">
        {/* Left Column: Info */}
        <div className="detail-col">
          <div className="detail-card">
            <h3>Profile Information</h3>
            <div className="info-row">
              <span className="info-label">Full Name</span>
              <span className="info-value">{user.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email Address</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Industry</span>
              <span className="info-value">{user.industry}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Joined Date</span>
              <span className="info-value">{user.joined}</span>
            </div>
          </div>

          <div className="detail-card danger-zone">
            <h3>Danger Zone</h3>
            <p>Suspending a user will immediately revoke their access to the platform.</p>
            <ButtonComponent 
              variant="danger" 
              onClick={handleSuspend}
              loading={loading}
              disabled={user.status === "suspended"}
            >
              {user.status === "suspended" ? "User Suspended" : "Suspend User"}
            </ButtonComponent>
          </div>
        </div>

        {/* Right Column: Subscription & Usage */}
        <div className="detail-col">
          <div className="detail-card">
            <h3>Subscription Status</h3>
            <div className="badges-row">
              <PlanBadge tier={user.plan} />
              <StatusBadge status={user.status} />
            </div>
            
            <div className="usage-meter">
              <div className="usage-labels">
                <span>AI Runs Usage</span>
                <span>{user.runsUsed} / {user.runsTotal}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min((user.runsUsed / user.runsTotal) * 100, 100)}%` }} 
                />
              </div>
            </div>

            <div className="action-row" style={{ marginTop: "24px" }}>
              <ButtonComponent variant="outline">Reset Runs</ButtonComponent>
              <ButtonComponent variant="outline">Change Plan</ButtonComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;
