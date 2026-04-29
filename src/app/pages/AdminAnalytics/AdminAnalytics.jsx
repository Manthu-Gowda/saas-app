import { useState, useEffect, useCallback } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import axiosInstance from "../../services/axiosInstance";
import { ADMIN_ANALYTICS } from "../../utils/apiPath";
import { errorToast } from "../../services/ToastHelper";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const COLORS = ["#6c47ff", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

const StatCard = ({ label, value, sub, color = "#6c47ff" }) => (
  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px 24px", flex: 1, minWidth: 160 }}>
    <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{sub}</div>}
  </div>
);

const SectionCard = ({ title, children }) => (
  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "24px", marginBottom: 20 }}>
    <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{title}</h3>
    {children}
  </div>
);

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await axiosInstance.get(ADMIN_ANALYTICS);
      setData(res);
    } catch { errorToast("Failed to load analytics"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>Loading analytics...</div>;
  if (!data) return null;

  const totalRuns = data.dailyRuns?.reduce((s, d) => s + d.runs, 0) || 0;
  const totalUsers = data.userGrowth?.reduce((s, d) => s + (d.count || d.newUsers || 0), 0) || 0;
  const topTool = data.toolUsage?.[0];
  const topIndustry = data.industryUsage?.[0];

  const planBreakdownFormatted = data.planBreakdown?.map((p) => ({
    name: p._id || "Unknown",
    value: p.count,
  })) || [];

  const industryChartData = data.industryUsage?.map((d) => ({ name: d._id || d.name, count: d.count })) || [];
  const providerChartData = data.providerUsage?.map((d) => ({ name: d._id || d.name || "Unknown", count: d.count })) || [];
  const userGrowthData = data.userGrowth?.map((d) => ({ ...d, newUsers: d.count || d.newUsers || 0 })) || [];

  return (
    <div>
      <SubHeader
        title="Analytics & Reporting"
        subTitle="30-day platform metrics and usage trends."
        showBack={false}
      />

      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard label="Total AI Runs (30d)" value={totalRuns.toLocaleString()} color="#6c47ff" />
        <StatCard label="New Users (30d)" value={totalUsers.toLocaleString()} color="#10b981" />
        <StatCard label="Top Tool" value={topTool?.name || "—"} sub={`${topTool?.count || 0} runs`} color="#f59e0b" />
        <StatCard label="Top Industry" value={topIndustry?._id || topIndustry?.name || "—"} sub={`${topIndustry?.count || 0} runs`} color="#3b82f6" />
      </div>

      <SectionCard title="Daily AI Runs — Last 30 Days">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.dailyRuns || []} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="_id" tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => v?.slice(5)} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
            <Line type="monotone" dataKey="runs" stroke="#6c47ff" strokeWidth={2.5} dot={false} name="Runs" />
          </LineChart>
        </ResponsiveContainer>
      </SectionCard>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <SectionCard title="User Growth — Last 30 Days">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={userGrowthData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="_id" tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => v?.slice(5)} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Line type="monotone" dataKey="newUsers" stroke="#10b981" strokeWidth={2.5} dot={false} name="New Users" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Plan Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={planBreakdownFormatted} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {planBreakdownFormatted.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <SectionCard title="Top Tools by Usage">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.toolUsage?.slice(0, 8) || []} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#475569" }} width={60} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Bar dataKey="count" fill="#6c47ff" radius={[0, 4, 4, 0]} name="Runs" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Runs by Industry">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={industryChartData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Runs" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {providerChartData.length > 0 && (
        <SectionCard title="AI Provider Usage">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={providerChartData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Runs" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      )}
    </div>
  );
};

export default AdminAnalytics;
