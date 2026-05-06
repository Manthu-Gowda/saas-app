import { useState, useEffect, useCallback } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import PlanBadge from "../../components/PlanBadge/PlanBadge";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import InputField from "../../components/InputField/InputField";
import SelectInput from "../../components/SelectInput/SelectInput";
import axiosInstance from "../../services/axiosInstance";
import { ADMIN_GET_SUBSCRIPTIONS } from "../../utils/apiPath";
import { errorToast } from "../../services/ToastHelper";
import { SearchOutlined } from "@ant-design/icons";

const PLAN_FILTER = [
  { label: "All Plans", value: "" },
  { label: "Free", value: "FREE" },
  { label: "Starter", value: "STARTER" },
  { label: "Pro", value: "PRO" },
  { label: "Business", value: "BUSINESS" },
];

const AdminSubscriptions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  const fetchSubs = useCallback(async (pg = 1, size = pageSize) => {
    setLoading(true);
    try {
      const { data: res } = await axiosInstance.get(ADMIN_GET_SUBSCRIPTIONS, {
        params: { pageIndex: pg, pageSize: size, search, plan: planFilter || undefined },
      });
      const items = res.data || res;
      setData(Array.isArray(items) ? items : []);
      setTotal(res.totalRecords || items.length);
    } catch { errorToast("Failed to load subscriptions"); }
    finally { setLoading(false); }
  }, [search, planFilter]);

  useEffect(() => { setPageIndex(1); fetchSubs(1, pageSize); }, [search, planFilter, pageSize]);
  useEffect(() => { fetchSubs(pageIndex, pageSize); }, [pageIndex, fetchSubs, pageSize]);

  const columns = [
    {
      title: "Subscriber",
      key: "name",
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600, color: "#0f172a" }}>{r.name}</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>{r.email}</div>
        </div>
      ),
    },
    {
      title: "Industry",
      key: "industry",
      render: (_, r) => r.industryId
        ? <span>{r.industryId.icon} {r.industryId.name}</span>
        : <span style={{ color: "#94a3b8" }}>—</span>,
    },
    {
      title: "Plan",
      key: "plan",
      render: (_, r) => <PlanBadge tier={r.planTier || "FREE"} />,
    },
    {
      title: "Status",
      key: "status",
      render: (_, r) => <StatusBadge status={r.status} />,
    },
    {
      title: "AI Runs",
      key: "runs",
      render: (_, r) => (
        <span style={{ fontSize: 13 }}>
          <strong style={{ color: "#0f172a" }}>{r.runsUsed}</strong>
          <span style={{ color: "#94a3b8" }}> / {r.runsTotal === -1 ? "∞" : r.runsTotal}</span>
        </span>
      ),
    },
    {
      title: "Joined",
      key: "joined",
      render: (_, r) => (
        <span style={{ fontSize: 12, color: "#64748b" }}>
          {new Date(r.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div>
      <SubHeader
        title="Subscriptions"
        subTitle="Monitor user plans and AI run usage across the platform."
        showBack={false}
      />

      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div style={{ flex: 1, maxWidth: 320 }}>
          <InputField
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            prefix={<SearchOutlined />}
          />
        </div>
        <div style={{ width: 180 }}>
          <SelectInput
            value={planFilter || undefined}
            onChange={(v) => setPlanFilter(v || "")}
            options={PLAN_FILTER}
            placeholder="Filter by plan"
          />
        </div>
      </div>

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

export default AdminSubscriptions;
