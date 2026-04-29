import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SubHeader from "../../components/SubHeader/SubHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import PlanBadge from "../../components/PlanBadge/PlanBadge";
import InputField from "../../components/InputField/InputField";
import SelectInput from "../../components/SelectInput/SelectInput";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import axiosInstance from "../../services/axiosInstance";
import { ADMIN_GET_USERS } from "../../utils/apiPath";
import { errorToast } from "../../services/ToastHelper";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import "./AdminUsers.scss";

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
  { label: "Inactive", value: "inactive" },
];

const PLAN_OPTIONS = [
  { label: "All Plans", value: "" },
  { label: "Free", value: "FREE" },
  { label: "Starter", value: "STARTER" },
  { label: "Pro", value: "PRO" },
  { label: "Business", value: "BUSINESS" },
];

const AdminUsers = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 25 });
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      if (planFilter) params.append("plan", planFilter);

      const { data: res } = await axiosInstance.get(`${ADMIN_GET_USERS}?${params}`);
      setData(res.users || []);
      setTotal(res.total || 0);
    } catch {
      errorToast("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, planFilter, page]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="user-name-cell">
          <div className="user-avatar">{(text || "U").charAt(0).toUpperCase()}</div>
          <div>
            <div className="user-name">{text}</div>
            <div className="user-email">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Industry",
      key: "industry",
      render: (_, record) => (
        <span>{record.industryId?.icon} {record.industryId?.name || "—"}</span>
      ),
    },
    {
      title: "Plan",
      dataIndex: "planTier",
      key: "planTier",
      width: 130,
      render: (plan) => <PlanBadge tier={plan} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: "Runs",
      key: "runs",
      width: 120,
      render: (_, r) => (
        <span style={{ fontSize: "12px", color: "#64748b" }}>
          {r.runsUsed} / {r.runsTotal === -1 ? "∞" : r.runsTotal}
        </span>
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (d) => new Date(d).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Tooltip title="View Details">
          <button className="action-btn" onClick={() => navigate(`/admin/users/${record._id}`)}>
            <EyeOutlined />
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="admin-users-page">
      <SubHeader
        title="User Management"
        subTitle={`${total} customers registered on the platform.`}
        showBack={false}
      />

      <div className="admin-users-filters">
        <div style={{ flex: 1, maxWidth: 320 }}>
          <InputField
            name="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            prefix={<SearchOutlined />}
          />
        </div>
        <div style={{ width: 180 }}>
          <SelectInput
            name="status"
            value={statusFilter || undefined}
            onChange={(v) => { setStatusFilter(v || ""); setPage(1); }}
            placeholder="Filter by status"
            options={STATUS_OPTIONS}
            allowClear
          />
        </div>
        <div style={{ width: 180 }}>
          <SelectInput
            name="plan"
            value={planFilter || undefined}
            onChange={(v) => { setPlanFilter(v || ""); setPage(1); }}
            placeholder="Filter by plan"
            options={PLAN_OPTIONS}
            allowClear
          />
        </div>
      </div>

      <div className="admin-users-content">
        <CustomTable
          rowKey="_id"
          columns={columns}
          dataSource={data}
          loading={loading}
          total={total}
          pageSize={25}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
};

export default AdminUsers;
