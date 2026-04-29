import { useState, useEffect } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import InputField from "../../components/InputField/InputField";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { successToast } from "../../services/ToastHelper";
import { getSessionUser, saveAuthToSession } from "../../services/auth";
import "./CustomerSettings.scss";

const CustomerSettings = () => {
  const user = getSessionUser();
  const [form, setForm] = useState({ name: "", email: "", newPassword: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", email: user.email || "", newPassword: "" });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate save
      const updatedUser = { ...user, name: form.name, email: form.email };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      successToast("Settings updated successfully!");
      setForm(prev => ({ ...prev, newPassword: "" }));
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="settings-page">
      <SubHeader 
        title="Account Settings" 
        subTitle="Manage your personal information and security."
        showBack={false}
      />

      <div className="settings-card">
        <h3 className="settings-card__title">Profile Information</h3>
        <div className="settings-card__form">
          <InputField
            title="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <InputField
            title="Email Address"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled // Email change might require verification step in real app
            helperText="Contact support to change your email address."
          />
        </div>
      </div>

      <div className="settings-card">
        <h3 className="settings-card__title">Security</h3>
        <div className="settings-card__form">
          <InputField
            title="New Password"
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
          />
        </div>
      </div>

      <div className="settings-actions">
        <ButtonComponent 
          variant="primary" 
          size="lg" 
          loading={loading} 
          onClick={handleSave}
        >
          Save Changes
        </ButtonComponent>
      </div>
    </div>
  );
};

export default CustomerSettings;
