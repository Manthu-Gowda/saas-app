import { useState, useEffect, useCallback } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import PlanBadge from "../../components/PlanBadge/PlanBadge";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import CustomTable from "../../components/CustomTable/CustomTable";
import { getSessionUser } from "../../services/auth";
import axiosInstance from "../../services/axiosInstance";
import {
  GET_DASHBOARD,
  STRIPE_CREATE_CHECKOUT,
  STRIPE_CREATE_PORTAL,
  STRIPE_MY_INVOICES,
} from "../../utils/apiPath";
import { errorToast, successToast } from "../../services/ToastHelper";
import { CheckOutlined, DownloadOutlined, LinkOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
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

const STATUS_COLORS = { paid: "#10b981", open: "#f59e0b", void: "#94a3b8", uncollectible: "#ef4444", draft: "#94a3b8" };

const Billing = () => {
  const sessionUser = getSessionUser();
  const [userData, setUserData] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [invoicesLoading, setInvoicesLoading] = useState(false);

  const fetchInvoices = useCallback(async (pg = pageIndex, size = pageSize) => {
    setInvoicesLoading(true);
    try {
      const { data: invData } = await axiosInstance.get(STRIPE_MY_INVOICES, {
        params: { pageIndex: pg, pageSize: size }
      });
      setInvoices(invData.data || invData || []);
      setTotal(invData.totalRecords || (Array.isArray(invData) ? invData.length : 0));
    } catch {
      setInvoices([]);
    } finally {
      setInvoicesLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get(GET_DASHBOARD);
        setUserData(data);
      } catch {
        setUserData({ planTier: sessionUser?.planTier || "FREE", runsUsed: 0, runsTotal: 10 });
      }
    };

    // Check for Stripe redirect params
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      successToast(`Plan upgraded to ${PLAN_NAMES[params.get("plan")] || params.get("plan")}! Your new features are active.`);
      window.history.replaceState({}, "", "/billing");
    }
    if (params.get("canceled") === "true") {
      errorToast("Checkout cancelled. No changes were made.");
      window.history.replaceState({}, "", "/billing");
    }

    fetchData();
  }, []);

  useEffect(() => {
    fetchInvoices(pageIndex, pageSize);
  }, [fetchInvoices, pageIndex, pageSize]);

  const currentTier = userData?.planTier || sessionUser?.planTier || "FREE";
  const runsUsed = userData?.runsUsed ?? 0;
  const runsTotal = userData?.runsTotal ?? 10;
  const runsPercent = runsTotal === -1 ? 0 : Math.min((runsUsed / runsTotal) * 100, 100);

  const handleUpgrade = async (planId) => {
    if (planId === currentTier || planId === "FREE") return;
    setLoadingId(planId);
    try {
      const { data } = await axiosInstance.post(STRIPE_CREATE_CHECKOUT, { planTier: planId });
      if (data.url) {
        window.location.href = data.url;
      } else {
        errorToast(data.message || "Could not start checkout.");
      }
    } catch (err) {
      errorToast(err?.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const { data } = await axiosInstance.post(STRIPE_CREATE_PORTAL);
      if (data.url) {
        window.location.href = data.url;
      } else {
        errorToast(data.message || "Could not open billing portal.");
      }
    } catch (err) {
      errorToast(err?.response?.data?.message || "Billing portal unavailable. Please try again.");
    } finally {
      setPortalLoading(false);
    }
  };

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (currency || "usd").toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="billing-page">
      <SubHeader
        title="Billing & Subscription"
        subTitle="Manage your plan, payment methods, and invoices."
        showBack={false}
      />

      {/* Current plan card */}
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
              <div
                style={{
                  width: `${runsPercent}%`,
                  height: "100%",
                  borderRadius: 99,
                  background: runsPercent >= 90 ? "#ef4444" : "#6c47ff",
                  transition: "width 0.4s",
                }}
              />
            </div>
          )}
        </div>
        <div className="current-plan-card__action">
          <ButtonComponent variant="outline" loading={portalLoading} onClick={handleManageBilling}>
            Manage Billing in Stripe
          </ButtonComponent>
        </div>
      </div>

      {/* Pricing plans */}
      <div className="pricing-section">
        <h3 className="pricing-title">Plans</h3>
        <p className="pricing-subtitle">Choose the plan that fits your business needs.</p>

        <div className="pricing-grid">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === currentTier;
            const isDowngrade =
              ["FREE", "STARTER", "PRO", "BUSINESS"].indexOf(plan.id) <
              ["FREE", "STARTER", "PRO", "BUSINESS"].indexOf(currentTier);

            return (
              <div
                key={plan.id}
                className={`pricing-card ${plan.isPopular ? "is-popular" : ""} ${isCurrent ? "is-current" : ""}`}
              >
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
                    disabled={isCurrent || isDowngrade}
                    loading={loadingId === plan.id}
                    onClick={() => handleUpgrade(plan.id)}
                    style={{ width: "100%" }}
                  >
                    {isCurrent ? "Current Plan" : isDowngrade ? "Downgrade via Portal" : "Upgrade"}
                  </ButtonComponent>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice history */}
      <div className="invoices-section">
        <h3 className="invoices-title">Billing History</h3>
        {invoices.length === 0 ? (
          <div className="invoices-empty">
            No invoices yet. They will appear here after your first payment.
          </div>
        ) : (
          <div className="invoices-table-wrap">
            <CustomTable
              rowKey="_id"
              columns={[
                {
                  title: "Invoice #",
                  key: "number",
                  render: (_, inv) => <strong>{inv.number || inv.stripeInvoiceId?.slice(0, 14) || "—"}</strong>
                },
                {
                  title: "Date",
                  key: "date",
                  render: (_, inv) => <span style={{ color: "#64748b", fontSize: 13 }}>
                    {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : "—"}
                  </span>
                },
                {
                  title: "Amount",
                  key: "amount",
                  render: (_, inv) => <strong>{formatAmount(inv.amount, inv.currency)}</strong>
                },
                {
                  title: "Status",
                  key: "status",
                  render: (_, inv) => (
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: 99,
                        fontSize: 12,
                        fontWeight: 600,
                        background: `${STATUS_COLORS[inv.status] || "#94a3b8"}18`,
                        color: STATUS_COLORS[inv.status] || "#94a3b8",
                        textTransform: "capitalize",
                      }}
                    >
                      {inv.status}
                    </span>
                  )
                },
                {
                  title: "Actions",
                  key: "actions",
                  render: (_, inv) => (
                    <div style={{ display: "flex", gap: 8 }}>
                      {inv.invoicePdf && (
                        <Tooltip title="Download PDF">
                          <a href={inv.invoicePdf} target="_blank" rel="noreferrer" style={{ color: "#6c47ff" }}>
                            <DownloadOutlined />
                          </a>
                        </Tooltip>
                      )}
                      {inv.hostedInvoiceUrl && (
                        <Tooltip title="View Invoice">
                          <a href={inv.hostedInvoiceUrl} target="_blank" rel="noreferrer" style={{ color: "#64748b" }}>
                            <LinkOutlined />
                          </a>
                        </Tooltip>
                      )}
                    </div>
                  )
                }
              ]}
              dataSource={invoices}
              loading={invoicesLoading}
              total={total}
              pageSize={pageSize}
              pageIndex={pageIndex - 1}
              onPageChange={(p, size) => { setPageIndex(p); setPageSize(size); }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
