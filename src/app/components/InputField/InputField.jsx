import React from "react";
import "./InputField.scss";
import { Input, Space } from "antd";

const InputField = ({
  title,
  helperTitle = "",
  type = "text",
  value,
  onChange,
  name,
  placeholder,
  onKeyDown,
  disabled,
  maxLength,
  size = "large",
  required = false,
  errorText = "",
  helperText = "",
  prefix = null,
  suffix = null,
  addonBefore = null,
  addonAfter = null,
  autoComplete,
  id,
}) => {
  const hasError = Boolean(errorText);

  return (
    <div className={`forminput ${hasError ? "has-error" : ""}`}>
      {title && (
        <span className="input-label">
          {title}
          {required && <span className="required-asterisk"> *</span>}
          {helperTitle && <small className="helperTitle"> {helperTitle}</small>}
        </span>
      )}

      <div className="input-container">
        {type === "password" ? (
          <Input.Password
            id={id}
            className="input"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            maxLength={maxLength}
            disabled={disabled}
            size={size}
            prefix={prefix}
            autoComplete={autoComplete}
          />
        ) : (
          <Input
            id={id}
            className="input"
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            maxLength={maxLength}
            disabled={disabled}
            size={size}
            min={type === "number" ? 0 : undefined}
            step={type === "number" ? "any" : undefined}
            prefix={prefix}
            suffix={suffix}
            addonBefore={addonBefore}
            addonAfter={addonAfter}
            autoComplete={autoComplete}
          />
        )}
      </div>

      {hasError ? (
        <span className="input-error-text">{errorText}</span>
      ) : (
        helperText && <span className="input-helper-text">{helperText}</span>
      )}
    </div>
  );
};

export default InputField;
