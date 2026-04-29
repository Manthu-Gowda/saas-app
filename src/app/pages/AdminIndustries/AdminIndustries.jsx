import { useState, useEffect } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

// Dummy data
const MOCK_INDUSTRIES = [
  { id: "1", name: "Legal", toolsCount: 5, status: "active", icon: "⚖️" },
  { id: "2", name: "HR", toolsCount: 3, status: "active", icon: "👥" },
  { id: "3", name: "E-commerce", toolsCount: 4, status: "active", icon: "🛍️" },
  { id: "4", name: "Real Estate", toolsCount: 2, status: "active", icon: "🏢" },
  { id: "5", name: "Finance", toolsCount: 0, status: "inactive", icon: "💰" },
];

const AdminIndustries = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(MOCK_INDUSTRIES);
      setLoading(false);
    }, 500);
  }, []);

  const columns = [
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      width: 80,
      align: "center",
      render: (icon) => <span style={{ fontSize: "20px" }}>{icon}</span>,
    },
    {
      title: "Industry Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong style={{ color: "#0f172a" }}>{text}</strong>,
    },
    {
      title: "Associated Tools",
      dataIndex: "toolsCount",
      key: "toolsCount",
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
    <div className="admin-industries-page">
      <SubHeader 
        title="Industries" 
        subTitle="Manage available industries."
        showRight={true}
        rightActionLabel="Add Industry"
        rightActionIcon={<PlusOutlined />}
      />
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <CustomTable rowKey="id" columns={columns} dataSource={data} loading={loading} total={data.length} />
      </div>
    </div>
  );
};

export default AdminIndustries;
