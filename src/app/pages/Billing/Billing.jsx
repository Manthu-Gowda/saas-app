import { useState } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import PlanBadge from "../../components/PlanBadge/PlanBadge";
import { getSessionUser } from "../../services/auth";
import { CheckOutlined } from "@ant-design/icons";
import "./Billing.scss";

const PLANS = [
  {
    id: "free",
    tier: "FREE",
    name: "Starter Free",
    price: "$0",
    interval: "/ month",
    features: ["10 AI Runs per month", "Access to 2 basic tools", "Community Support"],
    buttonText: "Current Plan",
    disabled: true,
  },
  {
    id: "pro",
    tier: "PRO",
    name: "Professional",
    price: "$29",
    interval: "/ month",
    features: ["500 AI Runs per month", "Access to all tools in industry", "Priority Support", "Export to PDF/Word"],
    buttonText: "Upgrade to Pro",
    isPopular: true,
  },
  {
    id: "business",
    tier: "BUSINESS",
    name: "Business",
    price: "$99",
    interval: "/ month",
    features: ["Unlimited AI Runs", "Access to all tools across platform", "Dedicated Account Manager", "Custom tool creation"],
    buttonText: "Contact Sales",
  }
];

const Billing = () => {
  const user = getSessionUser();
  const [loadingId, setLoadingId] = useState(null);

  const handleUpgrade = (planId) => {
    setLoadingId(planId);
    setTimeout(() => {
      setLoadingId(null);
      // Simulate Stripe redirect
      window.location.href = "https://checkout.stripe.com/test";
    }, 1500);
  };

  return (
    <div className="billing-page">
      <SubHeader 
        title="Billing & Subscription" 
        subTitle="Manage your plan, payment methods, and invoices."
        showBack={false}
      />

      <div className="current-plan-card">
        <div className="current-plan-card__info">
          <h3>Your Current Plan</h3>
          <div className="plan-name-row">
            <span className="plan-name">{user?.planTier === "PRO" ? "Professional" : "Starter Free"}</span>
            <PlanBadge tier={user?.planTier || "FREE"} />
          </div>
          <p>You have used 12 of your 100 AI runs this billing cycle.</p>
        </div>
        <div className="current-plan-card__action">
          <ButtonComponent variant="outline">Manage Billing in Stripe</ButtonComponent>
        </div>
      </div>

      <div className="pricing-section">
        <h3 className="pricing-title">Upgrade Your Plan</h3>
        <p className="pricing-subtitle">Choose the plan that fits your business needs.</p>

        <div className="pricing-grid">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`pricing-card ${plan.isPopular ? "is-popular" : ""}`}>
              {plan.isPopular && <div className="popular-badge">Most Popular</div>}
              <div className="pricing-card__header">
                <PlanBadge tier={plan.tier} />
                <div className="price-block">
                  <span className="price">{plan.price}</span>
                  <span className="interval">{plan.interval}</span>
                </div>
                <h4 className="plan-title">{plan.name}</h4>
              </div>
              
              <div className="pricing-card__features">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="feature-item">
                    <CheckOutlined className="check-icon" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pricing-card__footer">
                <ButtonComponent
                  variant={plan.isPopular ? "primary" : "ghost"}
                  size="lg"
                  disabled={plan.disabled}
                  loading={loadingId === plan.id}
                  onClick={() => handleUpgrade(plan.id)}
                  style={{ width: "100%" }}
                >
                  {plan.buttonText}
                </ButtonComponent>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Billing;
