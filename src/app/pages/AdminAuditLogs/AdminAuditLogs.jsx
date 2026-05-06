import { useState, useEffect, useCallback } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import axiosInstance from "../../services/axiosInstance";
import { ADMIN_GET_AUDIT_LOGS } from "../../utils/apiPath";
import { errorToast } from "../../services/ToastHelper";

const ACTION_COLORS = {
  SUSPEND_USER: "#ef4444",
  ACTIVATE_USER: "#10b981",
  DELETE_USER: "#ef4444",
  RESET_RUNS: "#f59e0b",
  CHANGE_PLAN: "#6c47ff",
  UPDATE_USER: "#3b82f6",
};

const AdminAuditLogs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

    const fetchLogs = useCallback(async (pg = 1, size = pageSize) => {
    setLoading(true);
    try {
      const { data: res } = await axiosInstance.get(ADMIN_GET_AUDIT_LOGS, {
        params: { pageIndex: pg, pageSize: size },
      });
      setData(res.data || res);
      setTotal(res.totalRecords || (res.data ? res.data.length : res.length));
    } catch { errorToast("Failed to load audit logs"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLogs(pageIndex, pageSize); }, [fetchLogs, pageIndex, pageSize]);

  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action) => (
        <span style={{
          background: `${ACTION_COLORS[action] || "#64748b"}18`,
          color: ACTION_COLORS[action] || "#64748b",
          padding: "3px 10px",
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}>
          {action?.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      title: "Performed By",
      key: "by",
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 13 }}>{r.userId?.name || "System"}</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>{r.userId?.email}</div>
        </div>
      ),
    },
    {
      title: "Target",
      key: "target",
      render: (_, r) => (
        <div>
          <span style={{ fontSize: 12, color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: 4 }}>
            {r.targetType}
          </span>
          {r.metadata && Object.keys(r.metadata).length > 0 && (
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
              {Object.entries(r.metadata).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(", ")}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
      render: (ip) => <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>{ip || "—"}</span>,
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <div>
          <div style={{ fontSize: 13, color: "#0f172a" }}>{new Date(date).toLocaleDateString()}</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>{new Date(date).toLocaleTimeString()}</div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <SubHeader
        title="Audit Logs"
        subTitle="Track all admin actions for security and compliance."
        showBack={false}
      />
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <CustomTable
          rowKey="_id"
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

export default AdminAuditLogs;
