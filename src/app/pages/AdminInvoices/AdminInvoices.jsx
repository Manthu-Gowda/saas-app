import { useState, useEffect } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import InputField from "../../components/InputField/InputField";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

// Dummy data
const MOCK_INVOICES = [
  { id: "inv_1", number: "INV-2026-001", customer: "Alice Smith", date: "2026-04-15", amount: "$29.00", status: "paid" },
  { id: "inv_2", number: "INV-2026-002", customer: "Bob Jones", date: "2026-04-20", amount: "$99.00", status: "paid" },
  { id: "inv_3", number: "INV-2026-003", customer: "Charlie Brown", date: "2026-04-05", amount: "$29.00", status: "past_due" },
];

const AdminInvoices = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(MOCK_INVOICES);
      setLoading(false);
    }, 500);
  }, []);

  const filteredData = data.filter((i) => 
    i.customer.toLowerCase().includes(search.toLowerCase()) || 
    i.number.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Invoice Number",
      dataIndex: "number",
      key: "number",
      render: (text) => <strong style={{ color: "#0f172a" }}>{text}</strong>,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <StatusBadge status={status} variant={status === "paid" ? "active" : "suspended"} />,
    },
    {
      title: "Download",
      key: "download",
      align: "center",
      render: () => (
        <Tooltip title="Download PDF">
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#6c47ff" }}>
            <DownloadOutlined />
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="admin-invoices-page">
      <SubHeader title="Invoices" subTitle="View and manage customer billing history.">
        <div style={{ width: "300px" }}>
          <InputField
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice or customer..."
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

export default AdminInvoices;
