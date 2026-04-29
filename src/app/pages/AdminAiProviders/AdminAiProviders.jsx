import { useState, useEffect, useCallback } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import InputField from "../../components/InputField/InputField";
import SelectInput from "../../components/SelectInput/SelectInput";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import CustomModal from "../../components/CustomModal/CustomModal";
import axiosInstance from "../../services/axiosInstance";
import {
  ADMIN_GET_PROVIDERS, ADMIN_CREATE_PROVIDER,
  ADMIN_UPDATE_PROVIDER, ADMIN_DELETE_PROVIDER, ADMIN_TEST_PROVIDER,
} from "../../utils/apiPath";
import { successToast, errorToast, infoToast } from "../../services/ToastHelper";
import { PlusOutlined, EditOutlined, DeleteOutlined, ThunderboltOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Tooltip, Switch } from "antd";

const PROVIDER_PRESETS = [
  { label: "OpenAI", value: "openai", baseUrl: "https://api.openai.com/v1", model: "gpt-4o" },
  { label: "Anthropic", value: "anthropic", baseUrl: "https://api.anthropic.com", model: "claude-sonnet-4-6" },
  { label: "Google Gemini", value: "gemini", baseUrl: "https://generativelanguage.googleapis.com/v1beta", model: "gemini-1.5-pro" },
  { label: "Mistral", value: "mistral", baseUrl: "https://api.mistral.ai/v1", model: "mistral-large-latest" },
  { label: "Groq", value: "groq", baseUrl: "https://api.groq.com/openai/v1", model: "llama-3.3-70b-versatile" },
  { label: "Custom", value: "custom", baseUrl: "", model: "" },
];

const defaultForm = { name: "", slug: "", baseUrl: "", apiKey: "", defaultModel: "", isDefault: false, isActive: true, config: { maxTokens: 2000, temperature: 0.7 } };

const AdminAiProviders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState("");

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await axiosInstance.get(ADMIN_GET_PROVIDERS);
      setData(res);
    } catch { errorToast("Failed to load providers"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProviders(); }, [fetchProviders]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(defaultForm);
    setTestResult(null);
    setShowModal(true);
  };

  const openEdit = (provider) => {
    setEditTarget(provider);
    setForm({
      name: provider.name,
      slug: provider.slug,
      baseUrl: provider.baseUrl,
      apiKey: "",
      defaultModel: provider.defaultModel,
      isDefault: provider.isDefault,
      isActive: provider.isActive,
      config: provider.config || { maxTokens: 2000, temperature: 0.7 },
    });
    setTestResult(null);
    setShowModal(true);
  };

  const handlePresetChange = (slug) => {
    const preset = PROVIDER_PRESETS.find((p) => p.value === slug);
    if (preset && slug !== "custom") {
      setForm((prev) => ({ ...prev, name: preset.label, slug: preset.value, baseUrl: preset.baseUrl, defaultModel: preset.model }));
    } else {
      setForm((prev) => ({ ...prev, slug }));
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) { errorToast("Name and slug are required"); return; }
    setSaving(true);
    try {
      if (editTarget) {
        await axiosInstance.patch(ADMIN_UPDATE_PROVIDER(editTarget._id), form);
        successToast("Provider updated");
      } else {
        await axiosInstance.post(ADMIN_CREATE_PROVIDER, form);
        successToast("Provider added");
      }
      setShowModal(false);
      fetchProviders();
    } catch (err) {
      errorToast(err.response?.data?.message || "Failed to save provider");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(ADMIN_DELETE_PROVIDER(deleteTarget._id));
      successToast("Provider deleted");
      setDeleteTarget(null);
      fetchProviders();
    } catch { errorToast("Failed to delete provider"); }
    finally { setDeleting(false); }
  };

  const handleTest = async (providerId) => {
    setTesting(providerId);
    setTestResult(null);
    try {
      const { data: res } = await axiosInstance.post(ADMIN_TEST_PROVIDER(providerId));
      setTestResult({ success: true, text: res.text, latencyMs: res.latencyMs });
      successToast(`Test passed in ${res.latencyMs}ms`);
    } catch (err) {
      setTestResult({ success: false, message: err.response?.data?.message || "Test failed" });
      errorToast("Provider test failed");
    } finally { setTesting(""); }
  };

  const columns = [
    {
      title: "Provider",
      key: "name",
      render: (_, r) => (
        <div>
          <strong style={{ color: "#0f172a" }}>{r.name}</strong>
          {r.isDefault && <span style={{ marginLeft: 8, background: "#ede8ff", color: "#6c47ff", padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>DEFAULT</span>}
          <div style={{ fontSize: 11, color: "#94a3b8" }}>{r.slug}</div>
        </div>
      ),
    },
    { title: "Default Model", dataIndex: "defaultModel", key: "defaultModel" },
    {
      title: "API Key",
      key: "apiKey",
      render: (_, r) => (
        <span style={{ color: r.hasApiKey ? "#10b981" : "#ef4444", fontSize: 12, fontWeight: 600 }}>
          {r.hasApiKey ? "✓ Configured" : "✗ Missing"}
        </span>
      ),
    },
    { title: "Status", dataIndex: "status", key: "status", render: (_, r) => <StatusBadge status={r.isActive ? "active" : "inactive"} /> },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          <Tooltip title="Test Connection">
            <button style={{ background: "none", border: "none", cursor: "pointer", color: testing === record._id ? "#94a3b8" : "#10b981" }}
              onClick={() => handleTest(record._id)} disabled={testing === record._id || !record.hasApiKey}>
              <ThunderboltOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Edit">
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#6c47ff" }} onClick={() => openEdit(record)}>
              <EditOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }} onClick={() => setDeleteTarget(record)}>
              <DeleteOutlined />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <SubHeader
        title="AI Providers"
        subTitle="Manage LLM integrations. API keys are stored encrypted."
        showBack={false}
        showRight
        rightActionLabel="Add Provider"
        rightActionIcon={<PlusOutlined />}
        onRightClick={openCreate}
      />

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <CustomTable rowKey="_id" columns={columns} dataSource={data} loading={loading} total={data.length} />
      </div>

      {/* Add/Edit Modal */}
      <CustomModal
        open={showModal}
        title={editTarget ? `Edit: ${editTarget.name}` : "Add AI Provider"}
        onClose={() => setShowModal(false)}
        primaryText={editTarget ? "Save Changes" : "Add Provider"}
        dangerText="Cancel"
        onPrimary={handleSave}
        primaryProps={{ loading: saving }}
        width={560}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {!editTarget && (
            <SelectInput
              title="Provider Preset"
              value={form.slug || undefined}
              onChange={handlePresetChange}
              options={PROVIDER_PRESETS}
              placeholder="Choose a preset or Custom..."
            />
          )}
          <InputField title="Provider Name *" name="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. OpenAI" />
          <InputField title="Slug *" name="slug" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="e.g. openai" />
          <InputField title="Base URL" name="baseUrl" value={form.baseUrl} onChange={(e) => setForm((p) => ({ ...p, baseUrl: e.target.value }))} placeholder="https://api.openai.com/v1" />
          <InputField
            title={editTarget ? "API Key (leave blank to keep current)" : "API Key *"}
            name="apiKey"
            type="password"
            value={form.apiKey}
            onChange={(e) => setForm((p) => ({ ...p, apiKey: e.target.value }))}
            placeholder={editTarget ? "••••••••••••••••" : "sk-..."}
            helperText="Stored encrypted. Never exposed to clients."
          />
          <InputField title="Default Model" name="defaultModel" value={form.defaultModel} onChange={(e) => setForm((p) => ({ ...p, defaultModel: e.target.value }))} placeholder="e.g. gpt-4o" />
          <div style={{ display: "flex", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: "#475569" }}>Set as Default</label>
              <div><Switch checked={form.isDefault} onChange={(v) => setForm((p) => ({ ...p, isDefault: v }))} /></div>
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#475569" }}>Active</label>
              <div><Switch checked={form.isActive} onChange={(v) => setForm((p) => ({ ...p, isActive: v }))} /></div>
            </div>
          </div>
        </div>
      </CustomModal>

      {/* Delete Confirm */}
      <CustomModal
        open={Boolean(deleteTarget)}
        title="Delete Provider"
        onClose={() => setDeleteTarget(null)}
        primaryText="Delete"
        dangerText="Cancel"
        onPrimary={handleDelete}
        primaryProps={{ variant: "danger", loading: deleting }}
      >
        <p>Delete <strong>{deleteTarget?.name}</strong>? Tools using this provider will fall back to the platform default.</p>
      </CustomModal>
    </div>
  );
};

export default AdminAiProviders;
