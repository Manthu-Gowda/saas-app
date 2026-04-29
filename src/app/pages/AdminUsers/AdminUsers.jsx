import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubHeader from "../../components/SubHeader/SubHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import PlanBadge from "../../components/PlanBadge/PlanBadge";
import InputField from "../../components/InputField/InputField";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import "./AdminUsers.scss";

// Dummy data
const MOCK_USERS = [
  { id: "1", name: "Alice Smith", email: "alice@acme.com", plan: "PRO", status: "active", joined: "2026-01-15" },
  { id: "2", name: "Bob Jones", email: "bob@realestate.com", plan: "BUSINESS", status: "active", joined: "2026-02-20" },
  { id: "3", name: "Charlie Brown", email: "charlie@gmail.com", plan: "FREE", status: "inactive", joined: "2026-03-05" },
  { id: "4", name: "Diana Prince", email: "diana@amazon.com", plan: "PRO", status: "suspended", joined: "2026-04-10" },
];

const AdminUsers = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(MOCK_USERS);
      setLoading(false);
    }, 600);
  }, []);

  const filteredData = data.filter((u) => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="user-name-cell">
          <div className="user-avatar">{text.charAt(0)}</div>
          <div>
            <div className="user-name">{text}</div>
            <div className="user-email">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
      width: 150,
      render: (plan) => <PlanBadge tier={plan} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: "Joined Date",
      dataIndex: "joined",
      key: "joined",
      width: 150,
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      align: "center",
      render: (_, record) => (
        <div className="table-actions">
          <Tooltip title="View Details">
            <button className="action-btn" onClick={() => navigate(`/admin/users/${record.id}`)}>
              <EyeOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Edit User">
            <button className="action-btn edit-btn">
              <EditOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Suspend/Delete">
            <button className="action-btn delete-btn">
              <DeleteOutlined />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-users-page">
      <SubHeader 
        title="User Management" 
        subTitle="Manage all customers and admins across the platform."
        showRight={true}
        rightActionLabel="Export Users"
        onRightClick={() => {}}
      >
        <div style={{ width: "300px" }}>
          <InputField
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            prefix={<SearchOutlined />}
          />
        </div>
      </SubHeader>

      <div className="admin-users-content">
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

export default AdminUsers;
