import { useState, useEffect } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { CopyOutlined, EyeOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { successToast, errorToast } from "../../services/ToastHelper";
import axiosInstance from "../../services/axiosInstance";
import { GET_HISTORY } from "../../utils/apiPath";
import "./History.scss";

const History = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(GET_HISTORY);
        
        // Map the backend data to the table format
        const formattedData = data.map(item => ({
          id: item._id,
          date: new Date(item.createdAt).toLocaleString(),
          toolName: item.toolId?.name || "Unknown Tool",
          prompt: item.prompt,
          status: item.status
        }));
        
        setData(formattedData);
      } catch (error) {
        errorToast("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    successToast("Prompt copied to clipboard");
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 180,
    },
    {
      title: "Tool Used",
      dataIndex: "toolName",
      key: "toolName",
      width: 200,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Prompt Snippet",
      dataIndex: "prompt",
      key: "prompt",
      ellipsis: true,
      render: (text) => (
        <div className="prompt-cell">
          <span className="prompt-text">{text}</span>
          <Tooltip title="Copy prompt">
            <button className="copy-btn" onClick={() => handleCopy(text)}>
              <CopyOutlined />
            </button>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <StatusBadge 
          status={status} 
          variant={status === "completed" ? "active" : "suspended"} 
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      align: "center",
      render: () => (
        <Tooltip title="View Details">
          <button className="action-btn">
            <EyeOutlined />
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="history-page">
      <SubHeader 
        title="Generation History" 
        subTitle="Review your past AI tool executions and copy prompts."
        showBack={false}
      />

      <div className="history-content">
        <CustomTable
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          total={data.length}
        />
      </div>
    </div>
  );
};

export default History;
