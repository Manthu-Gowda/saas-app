import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SubHeader from "../../components/SubHeader/SubHeader";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SelectInput from "../../components/SelectInput/SelectInput";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import PlanBadge from "../../components/PlanBadge/PlanBadge";
import CustomModal from "../../components/CustomModal/CustomModal";
import { successToast, errorToast } from "../../services/ToastHelper";
import axiosInstance from "../../services/axiosInstance";
import {
  ADMIN_GET_USER, ADMIN_SUSPEND_USER, ADMIN_ACTIVATE_USER,
  ADMIN_RESET_RUNS, ADMIN_CHANGE_PLAN,
} from "../../utils/apiPath";
import { Tooltip } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import "./AdminUserDetail.scss";

const PLAN_OPTIONS = [
  { label: "Free (10 runs)", value: "FREE" },
  { label: "Starter (100 runs)", value: "STARTER" },
  { label: "Pro (500 runs)", value: "PRO" },
  { label: "Business (unlimited)", value: "BUSINESS" },
];

const AdminUserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [history, setHistory] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const loadUser = async () => {
    try {
      const { data } = await axiosInstance.get(ADMIN_GET_USER(userId));
      setUserData(data.user);
      setHistory(data.recentHistory || []);
      setAuditLogs(data.auditLogs || []);
    } catch {
      errorToast("Failed to load user details");
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUser(); }, [userId]);

  const handleSuspend = async () => {
    setActionLoading("suspend");
    try {
      await axiosInstance.post(ADMIN_SUSPEND_USER(userId), { reason: "Admin action" });
      successToast("User suspended");
      setShowSuspendModal(false);
      loadUser();
    } catch { errorToast("Failed to suspend user"); }
    finally { setActionLoading(""); }
  };

  const handleActivate = async () => {
    setActionLoading("activate");
    try {
      await axiosInstance.post(ADMIN_ACTIVATE_USER(userId));
      successToast("User activated");
      loadUser();
    } catch { errorToast("Failed to activate user"); }
    finally { setActionLoading(""); }
  };

  const handleResetRuns = async () => {
    setActionLoading("reset");
    try {
      await axiosInstance.post(ADMIN_RESET_RUNS(userId));
      successToast("AI runs reset");
      loadUser();
    } catch { errorToast("Failed to reset runs"); }
    finally { setActionLoading(""); }
  };

  const handleChangePlan = async () => {
    if (!selectedPlan) return;
    setActionLoading("plan");
    try {
      await axiosInstance.post(ADMIN_CHANGE_PLAN(userId), { planTier: selectedPlan });
      successToast(`Plan changed to ${selectedPlan}`);
      setShowPlanModal(false);
      loadUser();
    } catch { errorToast("Failed to change plan"); }
    finally { setActionLoading(""); }
  };

  const copyId = () => {
    navigator.clipboard.writeText(userId);
    successToast("User ID copied");
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
  if (!userData) return null;

  const runsPercent = userData.runsTotal > 0
    ? Math.min((userData.runsUsed / userData.runsTotal) * 100, 100)
    : 0;

  return (
    <div className="admin-user-detail-page">
      <SubHeader
        title={userData.name}
        subTitle={userData.email}
        onBack={() => navigate("/admin/users")}
      />

      <div className="detail-grid">
        {/* Left Column */}
        <div className="detail-col">
          <div className="detail-card">
            <h3>Profile Information</h3>
            <div className="info-row">
              <span className="info-label">Full Name</span>
              <span className="info-value">{userData.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{userData.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Industry</span>
              <span className="info-value">
                {userData.industryId
                  ? `${userData.industryId.icon} ${userData.industryId.name}`
                  : "Not selected"}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Joined</span>
              <span className="info-value">{new Date(userData.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="info-row">
              <span className="info-label">User ID</span>
              <span className="info-value id-row">
                <span className="id-text">{userData._id}</span>
                <Tooltip title="Copy ID">
                  <button className="copy-btn" onClick={copyId}><CopyOutlined /></button>
                </Tooltip>
              </span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="detail-card">
            <h3>Recent Tool Usage</h3>
            {history.length > 0 ? (
              <div className="history-list">
                {history.map((h) => (
                  <div key={h._id} className="history-item">
                    <span className="history-tool">{h.toolId?.name || "Unknown tool"}</span>
                    <span className="history-date">{new Date(h.createdAt).toLocaleDateString()}</span>
                    <span className={`history-status ${h.status}`}>{h.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text">No tool usage yet</p>
            )}
          </div>

          {/* Danger Zone */}
          <div className="detail-card danger-zone">
            <h3>Account Actions</h3>
            <div className="danger-actions">
              {userData.status === "suspended" ? (
                <ButtonComponent
                  variant="outline"
                  loading={actionLoading === "activate"}
                  onClick={handleActivate}
                >
                  Activate Account
                </ButtonComponent>
              ) : (
                <ButtonComponent
                  variant="danger"
                  onClick={() => setShowSuspendModal(true)}
                  disabled={userData.status === "suspended"}
                >
                  Suspend User
                </ButtonComponent>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="detail-col">
          <div className="detail-card">
            <h3>Subscription & Usage</h3>
            <div className="badges-row">
              <PlanBadge tier={userData.planTier} />
              <StatusBadge status={userData.status} />
            </div>

            <div className="usage-meter">
              <div className="usage-labels">
                <span>AI Runs Usage</span>
                <span>{userData.runsUsed} / {userData.runsTotal === -1 ? "Unlimited" : userData.runsTotal}</span>
              </div>
              {userData.runsTotal !== -1 && (
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${runsPercent}%`,
                      backgroundColor: runsPercent >= 90 ? "#ef4444" : "#6c47ff",
                    }}
                  />
                </div>
              )}
            </div>

            <div className="action-row" style={{ marginTop: "20px" }}>
              <ButtonComponent
                variant="outline"
                loading={actionLoading === "reset"}
                onClick={handleResetRuns}
              >
                Reset Runs
              </ButtonComponent>
              <ButtonComponent
                variant="outline"
                onClick={() => { setSelectedPlan(userData.planTier); setShowPlanModal(true); }}
              >
                Change Plan
              </ButtonComponent>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="detail-card">
            <h3>Admin Actions on This User</h3>
            {auditLogs.length > 0 ? (
              <div className="audit-list">
                {auditLogs.map((log) => (
                  <div key={log._id} className="audit-item">
                    <span className="audit-action">{log.action.replace(/_/g, " ")}</span>
                    <span className="audit-by">{log.userId?.name}</span>
                    <span className="audit-date">{new Date(log.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text">No admin actions yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Suspend Confirm Modal */}
      <CustomModal
        open={showSuspendModal}
        title="Suspend User"
        onClose={() => setShowSuspendModal(false)}
        primaryText="Suspend"
        dangerText="Cancel"
        onPrimary={handleSuspend}
        primaryProps={{ variant: "danger", loading: actionLoading === "suspend" }}
      >
        <p>Are you sure you want to suspend <strong>{userData.name}</strong>? This will immediately revoke their access.</p>
      </CustomModal>

      {/* Change Plan Modal */}
      <CustomModal
        open={showPlanModal}
        title="Change Subscription Plan"
        onClose={() => setShowPlanModal(false)}
        primaryText="Confirm Change"
        dangerText="Cancel"
        onPrimary={handleChangePlan}
        primaryProps={{ loading: actionLoading === "plan" }}
      >
        <p style={{ marginBottom: "16px" }}>Select a new plan for <strong>{userData.name}</strong>:</p>
        <SelectInput
          name="plan"
          title="New Plan"
          value={selectedPlan}
          onChange={setSelectedPlan}
          options={PLAN_OPTIONS}
          allowClear={false}
        />
      </CustomModal>
    </div>
  );
};

export default AdminUserDetail;
