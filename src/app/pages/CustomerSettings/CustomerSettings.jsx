import { useState, useEffect } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import InputField from "../../components/InputField/InputField";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { successToast, errorToast } from "../../services/ToastHelper";
import { getSessionUser } from "../../services/auth";
import axiosInstance from "../../services/axiosInstance";
import { GET_PROFILE, UPDATE_PROFILE, CHANGE_PASSWORD } from "../../utils/apiPath";
import "./CustomerSettings.scss";

const CustomerSettings = () => {
  const sessionUser = getSessionUser();
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get(GET_PROFILE);
        setProfile({ name: data.name || "", email: data.email || "" });
      } catch {
        if (sessionUser) {
          setProfile({ name: sessionUser.name || "", email: sessionUser.email || "" });
        }
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!profile.name.trim()) { errorToast("Name is required"); return; }
    setLoadingProfile(true);
    try {
      const { data } = await axiosInstance.patch(UPDATE_PROFILE, { name: profile.name });
      const updatedUser = { ...sessionUser, name: data.name || profile.name };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      successToast("Profile updated successfully!");
    } catch (err) {
      errorToast(err.response?.data?.message || "Failed to update profile");
    } finally { setLoadingProfile(false); }
  };

  const handleChangePassword = async () => {
    if (!passwords.currentPassword) { errorToast("Current password is required"); return; }
    if (!passwords.newPassword || passwords.newPassword.length < 6) { errorToast("New password must be at least 6 characters"); return; }
    if (passwords.newPassword !== passwords.confirmPassword) { errorToast("Passwords do not match"); return; }
    setLoadingPassword(true);
    try {
      await axiosInstance.post(CHANGE_PASSWORD, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      successToast("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      errorToast(err.response?.data?.message || "Failed to change password");
    } finally { setLoadingPassword(false); }
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
            value={profile.name}
            onChange={handleProfileChange}
            placeholder="Your full name"
          />
          <InputField
            title="Email Address"
            type="email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            disabled
            helperText="Contact support to change your email address."
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <ButtonComponent variant="primary" loading={loadingProfile} onClick={handleSaveProfile}>
            Save Profile
          </ButtonComponent>
        </div>
      </div>

      <div className="settings-card">
        <h3 className="settings-card__title">Change Password</h3>
        <div className="settings-card__form">
          <InputField
            title="Current Password"
            type="password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Enter current password"
          />
          <InputField
            title="New Password"
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            placeholder="At least 6 characters"
          />
          <InputField
            title="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Repeat new password"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <ButtonComponent variant="outline" loading={loadingPassword} onClick={handleChangePassword}>
            Change Password
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default CustomerSettings;
