import React from "react";
import { Input } from "antd";
import "./TextAreaField.scss";

const { TextArea } = Input;

const TextAreaField = ({
  title,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  errorText = "",
  helperText = "",
  rows = 4,
  maxLength,
  showCount = false,
  id,
}) => {
  const hasError = Boolean(errorText);

  return (
    <div className={`forminput ${hasError ? "has-error" : ""}`}>
      {title && (
        <span className="input-label">
          {title}
          {required && <span className="required-asterisk"> *</span>}
        </span>
      )}

      <div className="input-container">
        <TextArea
          id={id}
          className="textarea"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          showCount={showCount}
        />
      </div>

      {hasError ? (
        <span className="input-error-text">{errorText}</span>
      ) : (
        helperText && <span className="input-helper-text">{helperText}</span>
      )}
    </div>
  );
};

export default TextAreaField;
