import React from "react";
import "./PlanBadge.scss";

// tier: "FREE" | "STARTER" | "PRO" | "BUSINESS"
const PlanBadge = ({ tier = "FREE" }) => {
  const t = (tier || "").toUpperCase();
  return (
    <span className={`plan-badge plan-badge--${t}`}>
      {t}
    </span>
  );
};

export default PlanBadge;
