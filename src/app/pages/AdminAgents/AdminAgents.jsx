import { useState, useEffect, useCallback } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { errorToast, successToast } from "../../services/ToastHelper";
import axiosInstance from "../../services/axiosInstance";
import {
  ADMIN_AGENTS_LIST, ADMIN_AGENTS_CREATE, ADMIN_AGENTS_UPDATE, ADMIN_AGENTS_DELETE,
  ADMIN_GET_INDUSTRIES, ADMIN_GET_PROVIDERS,
} from "../../utils/apiPath";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, RobotOutlined,
  PlusCircleOutlined, MinusCircleOutlined,
} from "@ant-design/icons";
import { Modal, Tabs, Tooltip } from "antd";
import "./AdminAgents.scss";

const PLANS = ["FREE", "STARTER", "PRO", "BUSINESS"];
const FIELD_TYPES = ["text", "textarea", "select"];
const EMPTY_STEP = { stepNumber: 1, name: "", systemPrompt: "", userPromptTemplate: "", outputVariable: "", aiProviderId: "" };
const EMPTY_FIELD = { name: "", label: "", type: "text", required: true, placeholder: "", options: [] };
const EMPTY_AGENT = { name: "", description: "", icon: "🤖", industryId: "", planRequired: "FREE", status: "active", steps: [], inputFields: [] };

const AdminAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [industries, setIndustries] = useState([]);
  const [providers, setProviders] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_AGENT);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(ADMIN_AGENTS_LIST);
      setAgents(data);
    } catch { errorToast("Failed to load agents"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchAgents();
    axiosInstance.get(ADMIN_GET_INDUSTRIES).then(({ data }) => setIndustries(data)).catch(() => {});
    axiosInstance.get(ADMIN_GET_PROVIDERS).then(({ data }) => setProviders(data)).catch(() => {});
  }, []);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY_AGENT, steps: [], inputFields: [] }); setModalOpen(true); };

  const openEdit = (agent) => {
    setEditing(agent);
    setForm({
      name: agent.name,
      description: agent.description || "",
      icon: agent.icon || "🤖",
      industryId: agent.industryId?._id || agent.industryId || "",
      planRequired: agent.planRequired || "FREE",
      status: agent.status || "active",
      steps: agent.steps?.map((s) => ({ ...s })) || [],
      inputFields: agent.inputFields?.map((f) => ({ ...f, options: f.options || [] })) || [],
    });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); };

  // ── Steps helpers ──────────────────────────────────────────────────────────
  const addStep = () => {
    setForm((f) => ({
      ...f,
      steps: [...f.steps, { ...EMPTY_STEP, stepNumber: f.steps.length + 1 }],
    }));
  };

  const removeStep = (idx) => {
    setForm((f) => ({
      ...f,
      steps: f.steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, stepNumber: i + 1 })),
    }));
  };

  const updateStep = (idx, key, value) => {
    setForm((f) => {
      const steps = [...f.steps];
      steps[idx] = { ...steps[idx], [key]: value };
      return { ...f, steps };
    });
  };

  // ── Fields helpers ─────────────────────────────────────────────────────────
  const addField = () => setForm((f) => ({ ...f, inputFields: [...f.inputFields, { ...EMPTY_FIELD }] }));

  const removeField = (idx) => setForm((f) => ({ ...f, inputFields: f.inputFields.filter((_, i) => i !== idx) }));

  const updateField = (idx, key, value) => {
    setForm((f) => {
      const fields = [...f.inputFields];
      fields[idx] = { ...fields[idx], [key]: value };
      return { ...f, inputFields: fields };
    });
  };

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) { errorToast("Agent name is required"); return; }
    if (form.steps.length === 0) { errorToast("Add at least one step"); return; }
    for (const s of form.steps) {
      if (!s.name || !s.systemPrompt || !s.userPromptTemplate || !s.outputVariable) {
        errorToast(`Step ${s.stepNumber}: all fields are required`); return;
      }
    }
    setSaving(true);
    try {
      const payload = { ...form, industryId: form.industryId || null };
      if (editing) {
        await axiosInstance.patch(ADMIN_AGENTS_UPDATE(editing._id), payload);
        successToast("Agent updated");
      } else {
        await axiosInstance.post(ADMIN_AGENTS_CREATE, payload);
        successToast("Agent created");
      }
      closeModal();
      fetchAgents();
    } catch (err) {
      errorToast(err?.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (agent) => {
    if (!confirm(`Delete agent "${agent.name}"?`)) return;
    setDeletingId(agent._id);
    try {
      await axiosInstance.delete(ADMIN_AGENTS_DELETE(agent._id));
      successToast("Agent deleted");
      setAgents((a) => a.filter((x) => x._id !== agent._id));
    } catch { errorToast("Delete failed"); }
    finally { setDeletingId(null); }
  };

  const tabItems = [
    {
      key: "basic",
      label: "Basic Info",
      children: (
        <div className="agent-form-section">
          <div className="agent-form-row">
            <div className="agent-form-field" style={{ flex: "0 0 72px" }}>
              <label>Icon</label>
              <input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} maxLength={4} style={{ textAlign: "center", fontSize: 22 }} />
            </div>
            <div className="agent-form-field" style={{ flex: 1 }}>
              <label>Name *</label>
              <input placeholder="e.g. Content Pipeline" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
          </div>

          <div className="agent-form-field">
            <label>Description</label>
            <textarea placeholder="What does this agent do?" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>

          <div className="agent-form-row">
            <div className="agent-form-field" style={{ flex: 1 }}>
              <label>Industry</label>
              <select value={form.industryId} onChange={(e) => setForm((f) => ({ ...f, industryId: e.target.value }))}>
                <option value="">All Industries</option>
                {industries.map((ind) => <option key={ind._id} value={ind._id}>{ind.icon} {ind.name}</option>)}
              </select>
            </div>
            <div className="agent-form-field" style={{ flex: 1 }}>
              <label>Plan Required</label>
              <select value={form.planRequired} onChange={(e) => setForm((f) => ({ ...f, planRequired: e.target.value }))}>
                {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="agent-form-field" style={{ flex: 1 }}>
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "fields",
      label: `Input Fields (${form.inputFields.length})`,
      children: (
        <div className="agent-form-section">
          {form.inputFields.map((f, idx) => (
            <div key={idx} className="agent-subcard">
              <div className="agent-subcard__header">
                <span>Field {idx + 1}</span>
                <button type="button" className="remove-btn" onClick={() => removeField(idx)}><MinusCircleOutlined /></button>
              </div>
              <div className="agent-form-row">
                <div className="agent-form-field" style={{ flex: 1 }}>
                  <label>Name (key)</label>
                  <input placeholder="e.g. topic" value={f.name} onChange={(e) => updateField(idx, "name", e.target.value)} />
                </div>
                <div className="agent-form-field" style={{ flex: 1 }}>
                  <label>Label</label>
                  <input placeholder="e.g. Topic" value={f.label} onChange={(e) => updateField(idx, "label", e.target.value)} />
                </div>
                <div className="agent-form-field" style={{ flex: "0 0 120px" }}>
                  <label>Type</label>
                  <select value={f.type} onChange={(e) => updateField(idx, "type", e.target.value)}>
                    {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="agent-form-field" style={{ flex: "0 0 80px" }}>
                  <label>Required</label>
                  <select value={f.required ? "yes" : "no"} onChange={(e) => updateField(idx, "required", e.target.value === "yes")}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              <div className="agent-form-field">
                <label>Placeholder</label>
                <input placeholder="Hint text shown to user" value={f.placeholder} onChange={(e) => updateField(idx, "placeholder", e.target.value)} />
              </div>
              {f.type === "select" && (
                <div className="agent-form-field">
                  <label>Options (comma separated)</label>
                  <input placeholder="Option 1, Option 2, Option 3" value={f.options?.join(", ")} onChange={(e) => updateField(idx, "options", e.target.value.split(",").map((o) => o.trim()).filter(Boolean))} />
                </div>
              )}
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addField}><PlusCircleOutlined /> Add Input Field</button>
        </div>
      ),
    },
    {
      key: "steps",
      label: `Steps (${form.steps.length})`,
      children: (
        <div className="agent-form-section">
          {form.steps.map((s, idx) => (
            <div key={idx} className="agent-subcard">
              <div className="agent-subcard__header">
                <span className="step-num">Step {s.stepNumber}</span>
                <button type="button" className="remove-btn" onClick={() => removeStep(idx)}><MinusCircleOutlined /></button>
              </div>
              <div className="agent-form-row">
                <div className="agent-form-field" style={{ flex: 1 }}>
                  <label>Step Name *</label>
                  <input placeholder="e.g. Write Blog Post" value={s.name} onChange={(e) => updateStep(idx, "name", e.target.value)} />
                </div>
                <div className="agent-form-field" style={{ flex: 1 }}>
                  <label>Output Variable *</label>
                  <input placeholder="e.g. blog_post" value={s.outputVariable} onChange={(e) => updateStep(idx, "outputVariable", e.target.value)} />
                </div>
                <div className="agent-form-field" style={{ flex: 1 }}>
                  <label>AI Provider</label>
                  <select value={s.aiProviderId || ""} onChange={(e) => updateStep(idx, "aiProviderId", e.target.value)}>
                    <option value="">Platform Default</option>
                    {providers.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="agent-form-field">
                <label>System Prompt *</label>
                <textarea rows={3} placeholder="You are an expert..." value={s.systemPrompt} onChange={(e) => updateStep(idx, "systemPrompt", e.target.value)} />
              </div>
              <div className="agent-form-field">
                <label>User Prompt Template * <span style={{ fontWeight: 400, color: "#94a3b8" }}>(use &#123;variable&#125; to reference inputs or previous step outputs)</span></label>
                <textarea rows={3} placeholder="Write a blog post about {topic} targeting {audience}" value={s.userPromptTemplate} onChange={(e) => updateStep(idx, "userPromptTemplate", e.target.value)} />
              </div>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addStep}><PlusCircleOutlined /> Add Step</button>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-agents-page">
      <SubHeader title="AI Agents" subTitle="Create and manage multi-step AI workflow agents.">
        <ButtonComponent variant="primary" onClick={openCreate}>
          <PlusOutlined style={{ marginRight: 6 }} /> Create Agent
        </ButtonComponent>
      </SubHeader>

      {loading ? (
        <div className="agents-loading">Loading agents...</div>
      ) : agents.length === 0 ? (
        <div className="agents-empty">
          <RobotOutlined style={{ fontSize: 48, color: "#cbd5e1", marginBottom: 12 }} />
          <p>No agents yet. Create your first multi-step AI agent!</p>
        </div>
      ) : (
        <div className="agents-list">
          {agents.map((agent) => (
            <div key={agent._id} className="agent-row">
              <div className="agent-row__icon">{agent.icon}</div>
              <div className="agent-row__info">
                <div className="agent-row__name">{agent.name}</div>
                <div className="agent-row__meta">
                  {agent.steps?.length || 0} steps &nbsp;·&nbsp; {agent.planRequired}
                  {agent.industryId && <> &nbsp;·&nbsp; {agent.industryId.icon} {agent.industryId.name}</>}
                  &nbsp;·&nbsp;
                  <StatusBadge status={agent.status} />
                </div>
                <div className="agent-row__desc">{agent.description}</div>
              </div>
              <div className="agent-row__actions">
                <Tooltip title="Edit"><button className="icon-btn edit" onClick={() => openEdit(agent)}><EditOutlined /></button></Tooltip>
                <Tooltip title="Delete">
                  <button className="icon-btn delete" onClick={() => handleDelete(agent)} disabled={deletingId === agent._id}>
                    <DeleteOutlined />
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onCancel={closeModal}
        footer={null}
        title={editing ? `Edit: ${editing.name}` : "Create New Agent"}
        width={780}
        destroyOnHide
      >
        <div className="agent-modal-body">
          <Tabs items={tabItems} defaultActiveKey="basic" />
          <div className="agent-modal-footer">
            <ButtonComponent variant="outline" onClick={closeModal}>Cancel</ButtonComponent>
            <ButtonComponent variant="primary" loading={saving} onClick={handleSave}>
              {editing ? "Save Changes" : "Create Agent"}
            </ButtonComponent>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminAgents;
