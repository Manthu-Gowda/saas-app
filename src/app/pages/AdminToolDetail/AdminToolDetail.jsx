import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SubHeader from "../../components/SubHeader/SubHeader";
import InputField from "../../components/InputField/InputField";
import TextAreaField from "../../components/TextAreaField/TextAreaField";
import SelectInput from "../../components/SelectInput/SelectInput";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { successToast, errorToast } from "../../services/ToastHelper";
import axiosInstance from "../../services/axiosInstance";
import {
  ADMIN_GET_TOOL, ADMIN_UPDATE_TOOL, ADMIN_CREATE_TOOL,
  ADMIN_GET_INDUSTRIES, ADMIN_GET_PROVIDERS,
} from "../../utils/apiPath";

const PLAN_OPTIONS = [
  { label: "Free", value: "FREE" },
  { label: "Starter", value: "STARTER" },
  { label: "Pro", value: "PRO" },
  { label: "Business", value: "BUSINESS" },
];
const FORMAT_OPTIONS = [
  { label: "Markdown", value: "markdown" },
  { label: "Plain Text", value: "text" },
  { label: "JSON", value: "json" },
];
const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const AdminToolDetail = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const isNew = toolId === "new";

  const [form, setForm] = useState({
    name: "", slug: "", icon: "🤖", description: "",
    industryId: "", aiProviderId: "",
    systemPrompt: "", userPromptTemplate: "",
    planRequired: "FREE", outputFormat: "markdown",
    tokensPerRun: 2000, status: "active",
  });
  const [industries, setIndustries] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [indRes, provRes] = await Promise.all([
          axiosInstance.get(ADMIN_GET_INDUSTRIES),
          axiosInstance.get(ADMIN_GET_PROVIDERS),
        ]);
        setIndustries(indRes.data.map((i) => ({ label: `${i.icon} ${i.name}`, value: i._id })));
        setProviders([
          { label: "Platform Default", value: "" },
          ...provRes.data.map((p) => ({ label: p.name, value: p._id })),
        ]);

        if (!isNew) {
          const { data } = await axiosInstance.get(ADMIN_GET_TOOL(toolId));
          setForm({
            name: data.name || "",
            slug: data.slug || "",
            icon: data.icon || "🤖",
            description: data.description || "",
            industryId: data.industryId?._id || data.industryId || "",
            aiProviderId: data.aiProviderId?._id || data.aiProviderId || "",
            systemPrompt: data.systemPrompt || "",
            userPromptTemplate: data.userPromptTemplate || "",
            planRequired: data.planRequired || "FREE",
            outputFormat: data.outputFormat || "markdown",
            tokensPerRun: data.tokensPerRun || 2000,
            status: data.status || "active",
          });
        }
      } catch { errorToast("Failed to load data"); }
      finally { setLoading(false); }
    };
    loadData();
  }, [toolId, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value !== undefined ? value : "" }));
  };

  const handleSave = async () => {
    if (!form.name || !form.slug || !form.industryId) {
      errorToast("Name, slug, and industry are required");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, aiProviderId: form.aiProviderId || null };
      if (isNew) {
        await axiosInstance.post(ADMIN_CREATE_TOOL, payload);
        successToast("Tool created!");
      } else {
        await axiosInstance.patch(ADMIN_UPDATE_TOOL(toolId), payload);
        successToast("Tool updated!");
      }
      navigate("/admin/tools");
    } catch (err) {
      errorToast(err.response?.data?.message || "Failed to save tool");
    } finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: "900px" }}>
      <SubHeader
        title={isNew ? "Create New Tool" : `Edit: ${form.name}`}
        subTitle="Configure the tool AI prompts, fields, and settings."
        onBack={() => navigate("/admin/tools")}
      />

      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <InputField title="Tool Name *" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Contract Reviewer" />
          <InputField title="Slug * (URL-safe)" name="slug" value={form.slug} onChange={handleChange} placeholder="e.g. contract-reviewer" />
          <InputField title="Icon (emoji)" name="icon" value={form.icon} onChange={handleChange} placeholder="🤖" />
          <InputField title="Description" name="description" value={form.description} onChange={handleChange} placeholder="Brief description" />
          <SelectInput title="Industry *" value={form.industryId || undefined} onChange={(v) => handleSelect("industryId", v)} options={industries} required placeholder="Select industry" allowClear={false} />
          <SelectInput title="AI Provider Override" value={form.aiProviderId || undefined} onChange={(v) => handleSelect("aiProviderId", v)} options={providers} placeholder="Platform Default" />
          <SelectInput title="Plan Required" value={form.planRequired} onChange={(v) => handleSelect("planRequired", v)} options={PLAN_OPTIONS} allowClear={false} />
          <SelectInput title="Output Format" value={form.outputFormat} onChange={(v) => handleSelect("outputFormat", v)} options={FORMAT_OPTIONS} allowClear={false} />
          <SelectInput title="Status" value={form.status} onChange={(v) => handleSelect("status", v)} options={STATUS_OPTIONS} allowClear={false} />
          <InputField title="Est. Tokens Per Run" name="tokensPerRun" type="number" value={form.tokensPerRun} onChange={handleChange} />

          <div style={{ gridColumn: "1 / -1" }}>
            <TextAreaField title="System Prompt" name="systemPrompt" value={form.systemPrompt} onChange={handleChange} rows={5} placeholder="You are an expert AI assistant specialized in..." />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <TextAreaField
              title="User Prompt Template"
              name="userPromptTemplate"
              value={form.userPromptTemplate}
              onChange={handleChange}
              rows={8}
              placeholder="Use {field_name} placeholders that match your input field names..."
              helperText="Use {field_name} syntax — replaced with user inputs at runtime."
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
          <ButtonComponent variant="ghost" onClick={() => navigate("/admin/tools")}>Cancel</ButtonComponent>
          <ButtonComponent variant="primary" loading={saving} onClick={handleSave}>
            {isNew ? "Create Tool" : "Save Changes"}
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default AdminToolDetail;
