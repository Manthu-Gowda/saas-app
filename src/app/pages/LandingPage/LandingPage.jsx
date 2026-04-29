import { Link } from "react-router-dom";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { ArrowRightOutlined, RobotOutlined, TeamOutlined, RiseOutlined } from "@ant-design/icons";
import "./LandingPage.scss";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-header__brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-name">Zynapse</span>
        </div>
        <nav className="landing-header__nav">
          <Link to="/login" className="nav-link">Sign In</Link>
          <Link to="/signup">
            <ButtonComponent variant="primary">Get Started Free</ButtonComponent>
          </Link>
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">Now with GPT-4 & Claude 3 🚀</div>
            <h1 className="hero-title">
              AI Powered Tools <br />
              Tailored for <span className="highlight">Your Industry</span>
            </h1>
            <p className="hero-subtitle">
              Zynapse brings enterprise-grade AI to Legal, HR, Real Estate, E-commerce, Finance, and Marketing professionals. Work smarter, not harder.
            </p>
            <div className="hero-actions">
              <Link to="/signup">
                <ButtonComponent variant="primary" size="lg" icon={<ArrowRightOutlined />}>
                  Start for Free
                </ButtonComponent>
              </Link>
              <Link to="/login">
                <ButtonComponent variant="outline" size="lg">
                  View Demo
                </ButtonComponent>
              </Link>
            </div>
            <p className="hero-disclaimer">No credit card required. 10 free AI runs per month.</p>
          </div>
          <div className="hero-visual">
            <div className="mockup-window">
              <div className="mockup-header">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="mockup-body">
                <div className="mock-chat">
                  <div className="mock-bubble user">Analyze this NDA contract for risks...</div>
                  <div className="mock-bubble ai">
                    <strong>Contract Analysis:</strong><br/>
                    1. High Risk: Non-compete clause is overly broad (5 years).<br/>
                    2. Medium Risk: Liability cap is missing.<br/>
                    <em>Recommendation: Add standard limitation of liability clause.</em>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-header">
            <h2>Why choose Zynapse?</h2>
            <p>A unified platform that routes your requests to the best AI models.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{ background: "#ede8ff", color: "#6c47ff" }}><RobotOutlined /></div>
              <h3>Multi-Model Routing</h3>
              <p>We automatically route your prompts to the best model (GPT-4, Claude, Gemini) based on the specific tool you're using.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: "#dbeafe", color: "#3b82f6" }}><TeamOutlined /></div>
              <h3>Industry Specific</h3>
              <p>Don't settle for generic AI. Our prompts and workflows are meticulously engineered for 6 distinct professional industries.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: "#d1fae5", color: "#10b981" }}><RiseOutlined /></div>
              <h3>Instant Productivity</h3>
              <p>Skip the prompt engineering. Just fill out a form, hit run, and get professional, ready-to-use output in seconds.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-icon">⚡</span>
            <span className="brand-name">Zynapse</span>
          </div>
          <p>© 2026 Zynapse Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
