import { useState, useEffect, useCallback } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import InputField from "../../components/InputField/InputField";
import CustomModal from "../../components/CustomModal/CustomModal";
import axiosInstance from "../../services/axiosInstance";
import { ADMIN_GET_INDUSTRIES, ADMIN_CREATE_INDUSTRY, ADMIN_UPDATE_INDUSTRY, ADMIN_DELETE_INDUSTRY } from "../../utils/apiPath";
import { successToast, errorToast } from "../../services/ToastHelper";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Tooltip, Switch } from "antd";

const defaultForm = { name: "", slug: "", icon: "🏢", description: "", color: "#6c47ff" };

const AdminIndustries = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchIndustries = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await axiosInstance.get(ADMIN_GET_INDUSTRIES);
      setData(res);
    } catch { errorToast("Failed to load industries"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchIndustries(); }, [fetchIndustries]);

  const openCreate = () => { setEditTarget(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (ind) => {
    setEditTarget(ind);
    setForm({ name: ind.name, slug: ind.slug, icon: ind.icon, description: ind.description || "", color: ind.color || "#6c47ff" });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) { errorToast("Name and slug are required"); return; }
    setSaving(true);
    try {
      if (editTarget) {
        await axiosInstance.patch(ADMIN_UPDATE_INDUSTRY(editTarget._id), form);
        successToast("Industry updated");
      } else {
        await axiosInstance.post(ADMIN_CREATE_INDUSTRY, form);
        successToast("Industry created");
      }
      setShowModal(false);
      fetchIndustries();
    } catch (err) { errorToast(err.response?.data?.message || "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(ADMIN_DELETE_INDUSTRY(deleteTarget._id));
      successToast("Industry deleted");
      setDeleteTarget(null);
      fetchIndustries();
    } catch { errorToast("Failed to delete industry"); }
    finally { setDeleting(false); }
  };

  const toggleStatus = async (ind) => {
    try {
      await axiosInstance.patch(ADMIN_UPDATE_INDUSTRY(ind._id), { status: ind.status === "active" ? "inactive" : "active" });
      fetchIndustries();
    } catch { errorToast("Failed to update status"); }
  };

  const columns = [
    {
      title: "",
      dataIndex: "icon",
      key: "icon",
      width: 60,
      align: "center",
      render: (icon) => <span style={{ fontSize: "22px" }}>{icon}</span>,
    },
    {
      title: "Industry",
      key: "name",
      render: (_, r) => (
        <div>
          <strong style={{ color: "#0f172a" }}>{r.name}</strong>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>{r.slug}</div>
        </div>
      ),
    },
    { title: "Description", dataIndex: "description", key: "description", ellipsis: true },
    {
      title: "Status",
      key: "status",
      render: (_, r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Switch size="small" checked={r.status === "active"} onChange={() => toggleStatus(r)} />
          <StatusBadge status={r.status} />
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, r) => (
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          <Tooltip title="Edit">
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#6c47ff" }} onClick={() => openEdit(r)}><EditOutlined /></button>
          </Tooltip>
          <Tooltip title="Delete">
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }} onClick={() => setDeleteTarget(r)}><DeleteOutlined /></button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <SubHeader title="Industries" subTitle="Manage the industry modules available on the platform." showBack={false}
        showRight rightActionLabel="Add Industry" rightActionIcon={<PlusOutlined />} onRightClick={openCreate} />
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <CustomTable rowKey="_id" columns={columns} dataSource={data} loading={loading} total={data.length} />
      </div>

      <CustomModal open={showModal} title={editTarget ? "Edit Industry" : "Add Industry"}
        onClose={() => setShowModal(false)} primaryText={editTarget ? "Save" : "Create"}
        dangerText="Cancel" onPrimary={handleSave} primaryProps={{ loading: saving }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <InputField title="Name *" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Legal" />
          <InputField title="Slug *" name="slug" value={form.slug} onChange={handleChange} placeholder="e.g. legal" />
          <InputField title="Icon (emoji)" name="icon" value={form.icon} onChange={handleChange} placeholder="⚖️" />
          <InputField title="Color (hex)" name="color" value={form.color} onChange={handleChange} placeholder="#6c47ff" />
          <InputField title="Description" name="description" value={form.description} onChange={handleChange} placeholder="Brief description..." />
        </div>
      </CustomModal>

      <CustomModal open={Boolean(deleteTarget)} title="Delete Industry"
        onClose={() => setDeleteTarget(null)} primaryText="Delete" dangerText="Cancel"
        onPrimary={handleDelete} primaryProps={{ variant: "danger", loading: deleting }}>
        <p>Delete <strong>{deleteTarget?.name}</strong>? All associated tools will be affected.</p>
      </CustomModal>
    </div>
  );
};

export default AdminIndustries;
