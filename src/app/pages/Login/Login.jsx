import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/InputField/InputField";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { successToast, errorToast } from "../../services/ToastHelper";
import { saveAuthToSession } from "../../services/auth";
import axiosInstance from "../../services/axiosInstance";
import { LOGIN } from "../../utils/apiPath";
import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { data } = await axiosInstance.post(LOGIN, form);
      saveAuthToSession(data);
      successToast("Welcome back!");
      const role = data?.user?.role || "CUSTOMER";
      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        navigate("/admin/dashboard");
      } else if (!data?.user?.industryId) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      errorToast(err?.response?.data?.message || "Login failed. Please try again.");
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
          AI-Powered Tools for Every Industry
        </h1>
        <p className="auth-page__sub">
          Legal, HR, accounting, automotive, healthcare, education, insurance, logistics, and more in one platform.
        </p>
        <div className="auth-page__stats">
          {[
            { label: "AI Tools", value: "62" },
            { label: "Industries", value: "20" },
            { label: "Users", value: "10K+" },
          ].map((s) => (
            <div key={s.label} className="auth-page__stat">
              <span className="auth-page__stat-value">{s.value}</span>
              <span className="auth-page__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-page__right">
        <div className="auth-card">
          <div className="auth-card__header">
            <h2>Welcome back</h2>
            <p>Sign in to your Zynapse account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-card__form" noValidate>
            <InputField
              id="login-email"
              title="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              errorText={errors.email}
              autoComplete="email"
            />
            <InputField
              id="login-password"
              title="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              errorText={errors.password}
              autoComplete="current-password"
            />

            <div className="auth-card__forgot">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <ButtonComponent
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="auth-card__submit"
            >
              Sign In
            </ButtonComponent>
          </form>

          <div className="auth-card__footer">
            Don't have an account?{" "}
            <Link to="/signup">Create one free</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
