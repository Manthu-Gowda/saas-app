import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../../components/InputField/InputField";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { successToast, errorToast } from "../../services/ToastHelper";
import axiosInstance from "../../services/axiosInstance";
import { FORGOT_PASSWORD } from "../../utils/apiPath";
import "../Login/Login.scss";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await axiosInstance.post(FORGOT_PASSWORD, { email });
      setSuccess(true);
      successToast("Password reset link sent to your email");
    } catch (err) {
      errorToast(err?.response?.data?.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__left">
        <div className="auth-page__brand">
          <span className="auth-page__brand-icon">⚡</span>
          <span className="auth-page__brand-name">Zynapse</span>
        </div>
        <h1 className="auth-page__headline">
          Recover your account
        </h1>
        <p className="auth-page__sub">
          We'll email you instructions to reset your password and get back into your account.
        </p>
      </div>

      <div className="auth-page__right">
        <div className="auth-card">
          <div className="auth-card__header">
            <h2>Forgot Password</h2>
            <p>Enter your email to receive a reset link</p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="auth-card__form" noValidate>
              <InputField
                id="forgot-email"
                title="Email Address"
                type="email"
                name="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="you@example.com"
                required
                errorText={error}
              />

              <ButtonComponent
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="auth-card__submit"
                style={{ marginTop: "8px" }}
              >
                Send Reset Link
              </ButtonComponent>
            </form>
          ) : (
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <p style={{ color: "#10b981", fontSize: "16px", marginBottom: "16px" }}>
                ✓ Check your email inbox!
              </p>
              <p style={{ color: "#64748b", fontSize: "14px" }}>
                We've sent a password reset link to <strong>{email}</strong>.
              </p>
            </div>
          )}

          <div className="auth-card__footer">
            Remember your password?{" "}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
