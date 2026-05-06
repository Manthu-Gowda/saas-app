import { useState, useEffect, useCallback } from "react";
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
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  const fetchHistory = useCallback(async (pg = pageIndex, size = pageSize) => {
    setLoading(true);
    try {
      const { data: res } = await axiosInstance.get(GET_HISTORY, {
        params: { pageIndex: pg, pageSize: size }
      });
      
      const historyList = res.data || res;
      const formattedData = historyList.map(item => ({
        id: item._id,
        date: new Date(item.createdAt).toLocaleString(),
        toolName: item.toolId?.name || "Unknown Tool",
        prompt: item.prompt,
        status: item.status
      }));
      
      setData(formattedData);
      setTotal(res.totalRecords || formattedData.length);
    } catch (error) {
      errorToast("Failed to load history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(pageIndex, pageSize);
  }, [fetchHistory, pageIndex, pageSize]);

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
          total={total}
          pageSize={pageSize}
          pageIndex={pageIndex - 1}
          onPageChange={(p, size) => { setPageIndex(p); setPageSize(size); }}
        />
      </div>
    </div>
  );
};

export default History;
