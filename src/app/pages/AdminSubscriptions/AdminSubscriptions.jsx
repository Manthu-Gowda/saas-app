import { useState, useEffect } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import PlanBadge from "../../components/PlanBadge/PlanBadge";
import InputField from "../../components/InputField/InputField";
import { SearchOutlined } from "@ant-design/icons";

// Dummy data
const MOCK_SUBS = [
  { id: "sub_1", userName: "Alice Smith", email: "alice@acme.com", plan: "PRO", status: "active", nextBilling: "2026-05-15", amount: "$29.00" },
  { id: "sub_2", userName: "Bob Jones", email: "bob@realestate.com", plan: "BUSINESS", status: "active", nextBilling: "2026-05-20", amount: "$99.00" },
  { id: "sub_3", userName: "Charlie Brown", email: "charlie@gmail.com", plan: "PRO", status: "past_due", nextBilling: "2026-04-05", amount: "$29.00" },
];

const AdminSubscriptions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(MOCK_SUBS);
      setLoading(false);
    }, 600);
  }, []);

  const filteredData = data.filter((s) => 
    s.userName.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Subscriber",
      dataIndex: "userName",
      key: "userName",
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600, color: "#0f172a" }}>{text}</div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
      render: (plan) => <PlanBadge tier={plan} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Next Billing",
      dataIndex: "nextBilling",
      key: "nextBilling",
    },
  ];

  return (
    <div className="admin-subs-page">
      <SubHeader 
        title="Subscriptions" 
        subTitle="Monitor active subscriptions and recurring revenue."
      >
        <div style={{ width: "300px" }}>
          <InputField
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscriber..."
            prefix={<SearchOutlined />}
          />
        </div>
      </SubHeader>

      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <CustomTable
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          total={filteredData.length}
        />
      </div>
    </div>
  );
};

export default AdminSubscriptions;
