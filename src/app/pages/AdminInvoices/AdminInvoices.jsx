import { useState, useEffect, useCallback } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import InputField from "../../components/InputField/InputField";
import axiosInstance from "../../services/axiosInstance";
import { ADMIN_GET_INVOICES } from "../../utils/apiPath";
import { errorToast } from "../../services/ToastHelper";
import { SearchOutlined, DownloadOutlined, LinkOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

const statusVariant = (status) => {
  if (status === "paid") return "active";
  if (status === "open") return "inactive";
  return "suspended";
};

const AdminInvoices = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 25;

  const fetchInvoices = useCallback(
    async (pg = 1) => {
      setLoading(true);
      try {
        const { data: res } = await axiosInstance.get(ADMIN_GET_INVOICES, {
          params: { page: pg, limit: pageSize, search: search || undefined },
        });
        setData(res.invoices || []);
        setTotal(res.total || 0);
      } catch {
        errorToast("Failed to load invoices");
      } finally {
        setLoading(false);
      }
    },
    [search]
  );

  useEffect(() => {
    setPage(1);
    fetchInvoices(1);
  }, [search]);

  useEffect(() => {
    if (page > 1) fetchInvoices(page);
  }, [page]);

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (currency || "usd").toUpperCase(),
    }).format(amount / 100);
  };

  const columns = [
    {
      title: "Invoice #",
      key: "number",
      render: (_, r) => (
        <strong style={{ color: "#0f172a" }}>{r.number || r.stripeInvoiceId?.slice(0, 18) || "—"}</strong>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, r) =>
        r.userId ? (
          <div>
            <div style={{ fontWeight: 600, color: "#0f172a" }}>{r.userId.name}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{r.userId.email}</div>
          </div>
        ) : (
          <span style={{ color: "#94a3b8" }}>—</span>
        ),
    },
    {
      title: "Date",
      key: "date",
      render: (_, r) => (
        <span style={{ fontSize: 13, color: "#64748b" }}>
          {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, r) => <strong>{formatAmount(r.amount, r.currency)}</strong>,
    },
    {
      title: "Status",
      key: "status",
      render: (_, r) => (
        <StatusBadge status={r.status} variant={statusVariant(r.status)} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, r) => (
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          {r.invoicePdf && (
            <Tooltip title="Download PDF">
              <a href={r.invoicePdf} target="_blank" rel="noreferrer" style={{ color: "#6c47ff" }}>
                <DownloadOutlined />
              </a>
            </Tooltip>
          )}
          {r.hostedInvoiceUrl && (
            <Tooltip title="View in Stripe">
              <a href={r.hostedInvoiceUrl} target="_blank" rel="noreferrer" style={{ color: "#64748b" }}>
                <LinkOutlined />
              </a>
            </Tooltip>
          )}
          {!r.invoicePdf && !r.hostedInvoiceUrl && (
            <span style={{ color: "#cbd5e1", fontSize: 13 }}>—</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="admin-invoices-page">
      <SubHeader title="Invoices" subTitle="View and manage customer billing history.">
        <div style={{ width: 300 }}>
          <InputField
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice or customer..."
            prefix={<SearchOutlined />}
          />
        </div>
      </SubHeader>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <CustomTable
          rowKey="_id"
          columns={columns}
          dataSource={data}
          loading={loading}
          total={total}
          pageSize={pageSize}
          pageIndex={page - 1}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
};

export default AdminInvoices;
