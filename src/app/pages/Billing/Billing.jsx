import { useState, useEffect } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import PlanBadge from "../../components/PlanBadge/PlanBadge";
import { getSessionUser } from "../../services/auth";
import axiosInstance from "../../services/axiosInstance";
import { GET_DASHBOARD } from "../../utils/apiPath";
import { CheckOutlined } from "@ant-design/icons";
import "./Billing.scss";

const PLANS = [
  {
    id: "FREE",
    tier: "FREE",
    name: "Starter Free",
    price: "$0",
    interval: "/ month",
    features: ["10 AI runs per month", "Access to 2 basic tools", "Community support"],
  },
  {
    id: "STARTER",
    tier: "STARTER",
    name: "Starter",
    price: "$9",
    interval: "/ month",
    features: ["100 AI runs per month", "Access to all industry tools", "Email support"],
  },
  {
    id: "PRO",
    tier: "PRO",
    name: "Professional",
    price: "$29",
    interval: "/ month",
    features: ["500 AI runs per month", "Access to all tools", "Priority support", "Export to PDF/Word"],
    isPopular: true,
  },
  {
    id: "BUSINESS",
    tier: "BUSINESS",
    name: "Business",
    price: "$99",
    interval: "/ month",
    features: ["Unlimited AI runs", "All tools across platform", "Dedicated account manager", "Custom tool creation"],
  },
];

const PLAN_NAMES = { FREE: "Starter Free", STARTER: "Starter", PRO: "Professional", BUSINESS: "Business" };

const Billing = () => {
  const sessionUser = getSessionUser();
  const [userData, setUserData] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const fetchDash = async () => {
      try {
        const { data } = await axiosInstance.get(GET_DASHBOARD);
        setUserData(data);
      } catch {
        setUserData({ planTier: sessionUser?.planTier || "FREE", runsUsed: 0, runsTotal: 10 });
      }
    };
    fetchDash();
  }, []);

  const currentTier = userData?.planTier || sessionUser?.planTier || "FREE";
  const runsUsed = userData?.runsUsed ?? 0;
  const runsTotal = userData?.runsTotal ?? 10;
  const runsPercent = runsTotal === -1 ? 0 : Math.min((runsUsed / runsTotal) * 100, 100);

  const handleUpgrade = (planId) => {
    if (planId === currentTier) return;
    setLoadingId(planId);
    setTimeout(() => {
      setLoadingId(null);
      alert(`Stripe integration coming soon!\n\nSelected plan: ${planId}\n\nContact your admin to upgrade.`);
    }, 800);
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
            <span className="plan-name">{PLAN_NAMES[currentTier] || currentTier}</span>
            <PlanBadge tier={currentTier} />
          </div>
          <p>
            {runsTotal === -1
              ? `You have used ${runsUsed} AI runs this billing cycle (unlimited).`
              : `You have used ${runsUsed} of your ${runsTotal} AI runs this billing cycle.`}
          </p>
          {runsTotal !== -1 && (
            <div style={{ marginTop: 10, background: "#f1f5f9", borderRadius: 99, height: 8, overflow: "hidden" }}>
              <div style={{ width: `${runsPercent}%`, height: "100%", borderRadius: 99, background: runsPercent >= 90 ? "#ef4444" : "#6c47ff", transition: "width 0.4s" }} />
            </div>
          )}
        </div>
        <div className="current-plan-card__action">
          <ButtonComponent variant="outline">Manage Billing in Stripe</ButtonComponent>
        </div>
      </div>

      <div className="pricing-section">
        <h3 className="pricing-title">Plans</h3>
        <p className="pricing-subtitle">Choose the plan that fits your business needs.</p>

        <div className="pricing-grid">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === currentTier;
            return (
              <div key={plan.id} className={`pricing-card ${plan.isPopular ? "is-popular" : ""} ${isCurrent ? "is-current" : ""}`}>
                {plan.isPopular && !isCurrent && <div className="popular-badge">Most Popular</div>}
                {isCurrent && <div className="popular-badge current-badge">Your Plan</div>}
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
                    variant={isCurrent ? "ghost" : plan.isPopular ? "primary" : "ghost"}
                    size="lg"
                    disabled={isCurrent}
                    loading={loadingId === plan.id}
                    onClick={() => handleUpgrade(plan.id)}
                    style={{ width: "100%" }}
                  >
                    {isCurrent ? "Current Plan" : "Upgrade"}
                  </ButtonComponent>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Billing;
