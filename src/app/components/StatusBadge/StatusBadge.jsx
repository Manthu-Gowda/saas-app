import React from "react";
import "./StatusBadge.scss";

// variant: "active" | "inactive" | "suspended" | "pending" | "canceled" | "trialing" | "past_due" | "custom"
const StatusBadge = ({ status = "", label, variant, dot = true }) => {
  const normalized = (variant || status || "").toLowerCase().replace(/\s+/g, "_");

  const labelText = label || status;

  return (
    <span className={`status-badge status-badge--${normalized}`}>
      {dot && <span className="status-badge__dot" />}
      {labelText}
    </span>
  );
};

export default StatusBadge;
