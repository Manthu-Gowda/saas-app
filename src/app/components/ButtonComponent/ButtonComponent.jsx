import React from "react";
import "./ButtonComponent.scss";

const ButtonComponent = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  loading = false,
  variant = "primary", // primary | secondary | danger | ghost | outline
  size = "md",         // sm | md | lg
  icon = null,
  style,
  id,
}) => {
  return (
    <button
      id={id}
      type={type}
      className={`custom-button ${variant} size-${size} ${className} ${loading ? "loading" : ""}`}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
    >
      {loading && <span className="btn-spinner" />}
      {icon && !loading && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default ButtonComponent;
