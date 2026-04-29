import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/InputField/InputField";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { successToast, errorToast } from "../../services/ToastHelper";
import axiosInstance from "../../services/axiosInstance";
import { REGISTER } from "../../utils/apiPath";
import "../Login/Login.scss"; // Reuse Login styles

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
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
      await axiosInstance.post(REGISTER, {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      successToast("Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      errorToast(err?.response?.data?.message || "Registration failed. Please try again.");
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
          Join the AI Productivity Revolution
        </h1>
        <p className="auth-page__sub">
          Sign up today and get access to a tailored suite of AI tools for your industry.
        </p>
        <div className="auth-page__stats">
          {[
            { label: "AI Tools", value: "18+" },
            { label: "Industries", value: "6" },
            { label: "Free Runs", value: "10/mo" },
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
            <h2>Create Account</h2>
            <p>Start your free plan today</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-card__form" noValidate>
            <InputField
              id="signup-name"
              title="Full Name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              errorText={errors.name}
            />
            <InputField
              id="signup-email"
              title="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              errorText={errors.email}
            />
            <InputField
              id="signup-password"
              title="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              required
              errorText={errors.password}
            />
            <InputField
              id="signup-confirmPassword"
              title="Confirm Password"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
              required
              errorText={errors.confirmPassword}
            />

            <ButtonComponent
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="auth-card__submit"
              style={{ marginTop: "16px" }}
            >
              Sign Up
            </ButtonComponent>
          </form>

          <div className="auth-card__footer">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
