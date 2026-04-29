import { useState, useEffect } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

// Dummy data
const MOCK_PROVIDERS = [
  { id: "1", name: "OpenAI", model: "GPT-4o", apiKeyStatus: "configured", status: "active", isDefault: true },
  { id: "2", name: "Anthropic", model: "Claude 3.5 Sonnet", apiKeyStatus: "configured", status: "active", isDefault: false },
  { id: "3", name: "Google", model: "Gemini 1.5 Pro", apiKeyStatus: "configured", status: "active", isDefault: false },
  { id: "4", name: "Mistral", model: "Mistral Large", apiKeyStatus: "missing", status: "inactive", isDefault: false },
];

const AdminAiProviders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(MOCK_PROVIDERS);
      setLoading(false);
    }, 500);
  }, []);

  const columns = [
    {
      title: "Provider Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <strong style={{ color: "#0f172a" }}>{text}</strong>
          {record.isDefault && <span style={{ background: "#ede8ff", color: "#6c47ff", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold" }}>DEFAULT</span>}
        </div>
      ),
    },
    {
      title: "Default Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "API Key",
      dataIndex: "apiKeyStatus",
      key: "apiKeyStatus",
      render: (val) => (
        <span style={{ color: val === "configured" ? "#10b981" : "#ef4444", fontSize: "12px", fontWeight: 600 }}>
          {val === "configured" ? "✓ Configured" : "✗ Missing"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: () => (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Tooltip title="Configure Keys">
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6" }}><SettingOutlined /></button>
          </Tooltip>
          <Tooltip title="Edit">
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}><EditOutlined /></button>
          </Tooltip>
          <Tooltip title="Delete">
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}><DeleteOutlined /></button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-providers-page">
      <SubHeader 
        title="AI Providers" 
        subTitle="Manage LLM provider integrations and API keys."
        showRight={true}
        rightActionLabel="Add Provider"
        rightActionIcon={<PlusOutlined />}
      />
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <CustomTable rowKey="id" columns={columns} dataSource={data} loading={loading} total={data.length} />
      </div>
    </div>
  );
};

export default AdminAiProviders;
