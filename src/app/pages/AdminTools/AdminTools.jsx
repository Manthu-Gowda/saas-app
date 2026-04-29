import { useState, useEffect } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import InputField from "../../components/InputField/InputField";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

// Dummy data
const MOCK_TOOLS = [
  { id: "1", name: "Contract Reviewer", industry: "Legal", provider: "OpenAI GPT-4", status: "active" },
  { id: "2", name: "Resume Screener", industry: "HR", provider: "Claude 3 Sonnet", status: "active" },
  { id: "3", name: "Product Describer", industry: "E-commerce", provider: "Gemini 1.5 Pro", status: "active" },
  { id: "4", name: "Listing Generator", industry: "Real Estate", provider: "OpenAI GPT-3.5", status: "inactive" },
];

const AdminTools = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(MOCK_TOOLS);
      setLoading(false);
    }, 500);
  }, []);

  const filteredData = data.filter((t) => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.industry.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Tool Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong style={{ color: "#0f172a" }}>{text}</strong>,
    },
    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
    },
    {
      title: "Default AI Provider",
      dataIndex: "provider",
      key: "provider",
      render: (text) => <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", color: "#64748b" }}>{text}</span>
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
          <Tooltip title="Edit Tool">
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}><EditOutlined /></button>
          </Tooltip>
          <Tooltip title="Delete Tool">
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}><DeleteOutlined /></button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-tools-page">
      <SubHeader 
        title="AI Tools Management" 
        subTitle="Create and configure AI tools across all industries."
        showRight={true}
        rightActionLabel="Create Tool"
        rightActionIcon={<PlusOutlined />}
      >
        <div style={{ width: "300px" }}>
          <InputField
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            prefix={<SearchOutlined />}
          />
        </div>
      </SubHeader>
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <CustomTable rowKey="id" columns={columns} dataSource={filteredData} loading={loading} total={filteredData.length} />
      </div>
    </div>
  );
};

export default AdminTools;
