import { useState } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import InputField from "../../components/InputField/InputField";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Switch } from "antd";
import { successToast } from "../../services/ToastHelper";

const PLAN_LIMITS = [
  { tier: "FREE", label: "Free", runs: 10 },
  { tier: "STARTER", label: "Starter", runs: 100 },
  { tier: "PRO", label: "Pro", runs: 500 },
  { tier: "BUSINESS", label: "Business", runs: -1 },
];

const SectionCard = ({ title, sub, children }) => (
  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "24px 28px", marginBottom: 20 }}>
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{title}</h3>
      {sub && <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>{sub}</p>}
    </div>
    {children}
  </div>
);

const ToggleRow = ({ label, sub, checked, onChange }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
    <div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{sub}</div>}
    </div>
    <Switch checked={checked} onChange={onChange} />
  </div>
);

const AdminSettings = () => {
  const [platform, setPlatform] = useState({
    name: "Zynapse",
    supportEmail: "support@zynapse.com",
    maxRunsPerDay: 50,
  });
  const [features, setFeatures] = useState({
    registrationOpen: true,
    pdfExtraction: true,
    demoModeEnabled: true,
    maintenanceMode: false,
  });
  const [planLimits] = useState(PLAN_LIMITS);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      successToast("Settings saved (demo — no backend endpoint yet)");
    }, 800);
  };

  const toggleFeature = (key) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <SubHeader
        title="Platform Settings"
        subTitle="Configure global platform preferences and feature flags."
        showBack={false}
      />

      <SectionCard title="General" sub="Basic platform identity and contact info.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <InputField
            title="Platform Name"
            value={platform.name}
            onChange={(e) => setPlatform((p) => ({ ...p, name: e.target.value }))}
          />
          <InputField
            title="Support Email"
            type="email"
            value={platform.supportEmail}
            onChange={(e) => setPlatform((p) => ({ ...p, supportEmail: e.target.value }))}
          />
          <InputField
            title="Global Max Runs / Day (per user)"
            type="number"
            value={platform.maxRunsPerDay}
            onChange={(e) => setPlatform((p) => ({ ...p, maxRunsPerDay: Number(e.target.value) }))}
            helperText="Safety cap regardless of plan limits."
          />
        </div>
      </SectionCard>

      <SectionCard title="Plan Run Limits" sub="Monthly AI run allowances per plan tier.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {planLimits.map((pl) => (
            <div key={pl.tier} style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 13 }}>{pl.label}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{pl.tier}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#6c47ff" }}>
                {pl.runs === -1 ? "∞" : pl.runs.toLocaleString()}
                <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400, marginLeft: 4 }}>/ mo</span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 12 }}>
          To change run limits, update the seed data or add a platform settings API endpoint.
        </p>
      </SectionCard>

      <SectionCard title="Feature Flags" sub="Enable or disable platform features globally.">
        <ToggleRow
          label="Open Registration"
          sub="Allow new users to sign up. Disable to invite-only."
          checked={features.registrationOpen}
          onChange={() => toggleFeature("registrationOpen")}
        />
        <ToggleRow
          label="PDF Extraction"
          sub="Allow users to upload PDFs as tool inputs."
          checked={features.pdfExtraction}
          onChange={() => toggleFeature("pdfExtraction")}
        />
        <ToggleRow
          label="Demo Mode (Fallback AI)"
          sub="Return demo responses when no AI provider is configured."
          checked={features.demoModeEnabled}
          onChange={() => toggleFeature("demoModeEnabled")}
        />
        <ToggleRow
          label="Maintenance Mode"
          sub="Block all non-admin access and show a maintenance page."
          checked={features.maintenanceMode}
          onChange={() => toggleFeature("maintenanceMode")}
        />
      </SectionCard>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ButtonComponent variant="primary" loading={saving} onClick={handleSave}>
          Save Settings
        </ButtonComponent>
      </div>
    </div>
  );
};

export default AdminSettings;
