import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SubHeader from "../../components/SubHeader/SubHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import InputField from "../../components/InputField/InputField";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import CustomModal from "../../components/CustomModal/CustomModal";
import SelectInput from "../../components/SelectInput/SelectInput";
import axiosInstance from "../../services/axiosInstance";
import { ADMIN_GET_TOOLS, ADMIN_GET_INDUSTRIES, ADMIN_DELETE_TOOL, ADMIN_UPDATE_TOOL } from "../../utils/apiPath";
import { successToast, errorToast } from "../../services/ToastHelper";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

const AdminTools = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTools = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await axiosInstance.get(ADMIN_GET_TOOLS);
      setData(res);
    } catch { errorToast("Failed to load tools"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTools(); }, [fetchTools]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(ADMIN_DELETE_TOOL(deleteTarget._id));
      successToast("Tool deleted");
      setDeleteTarget(null);
      fetchTools();
    } catch { errorToast("Failed to delete tool"); }
    finally { setDeleting(false); }
  };

  const handleAddTool = () => {
    navigate("/admin/tools/new");
  };

  const toggleStatus = async (tool) => {
    try {
      await axiosInstance.patch(ADMIN_UPDATE_TOOL(tool._id), {
        status: tool.status === "active" ? "inactive" : "active",
      });
      successToast(`Tool ${tool.status === "active" ? "deactivated" : "activated"}`);
      fetchTools();
    } catch { errorToast("Failed to update tool status"); }
  };

  const filteredData = data.filter((t) =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.industryId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Tool",
      key: "name",
      render: (_, r) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>{r.icon || "🤖"}</span>
          <div>
            <div style={{ fontWeight: 600, color: "#0f172a" }}>{r.name}</div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>{r.slug}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Industry",
      key: "industry",
      render: (_, r) => (
        <span>{r.industryId?.icon} {r.industryId?.name || "—"}</span>
      ),
    },
    {
      title: "Provider",
      key: "provider",
      render: (_, r) => (
        <span style={{ background: "#f1f5f9", padding: "3px 8px", borderRadius: "4px", fontSize: "12px", color: "#475569" }}>
          {r.aiProviderId?.name || "Platform Default"}
        </span>
      ),
    },
    {
      title: "Plan",
      dataIndex: "planRequired",
      key: "planRequired",
      width: 100,
      render: (p) => <span style={{ fontSize: "12px", fontWeight: 600, color: "#6c47ff" }}>{p}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: "Actions",
      key: "actions",
      width: 130,
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
          <Tooltip title="Edit Tool">
            <button
              style={{ background: "none", border: "none", cursor: "pointer", color: "#6c47ff" }}
              onClick={() => navigate(`/admin/tools/${record._id}`)}
            ><EditOutlined /></button>
          </Tooltip>
          <Tooltip title={record.status === "active" ? "Deactivate" : "Activate"}>
            <button
              style={{ background: "none", border: "none", cursor: "pointer", color: record.status === "active" ? "#f59e0b" : "#10b981" }}
              onClick={() => toggleStatus(record)}
            >{record.status === "active" ? "⏸" : "▶"}</button>
          </Tooltip>
          <Tooltip title="Delete Tool">
            <button
              style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}
              onClick={() => setDeleteTarget(record)}
            ><DeleteOutlined /></button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-tools-page">
      <SubHeader
        title="AI Tools Management"
        subTitle={`${data.length} tools configured across all industries.`}
        showBack={false}
        showRight
        rightActionLabel="Add Tool"
        rightActionIcon={<PlusOutlined />}
        onRightClick={handleAddTool}
      />

      <div style={{ display: "flex", gap: "16px", marginBottom: "20px", alignItems: "flex-end" }}>
        <div style={{ flex: 1, maxWidth: 340 }}>
          <InputField
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools or industries..."
            prefix={<SearchOutlined />}
          />
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <CustomTable
          rowKey="_id"
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          total={filteredData.length}
        />
      </div>

      <CustomModal
        open={Boolean(deleteTarget)}
        title="Delete Tool"
        onClose={() => setDeleteTarget(null)}
        primaryText="Delete"
        dangerText="Cancel"
        onPrimary={handleDelete}
        primaryProps={{ variant: "danger", loading: deleting }}
      >
        <p>Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.</p>
      </CustomModal>
    </div>
  );
};

export default AdminTools;
