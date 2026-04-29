import React from "react";
import { Select } from "antd";
import "./MultiSelect.scss";

const MultiSelect = ({
  title,
  name,
  value,
  onChange,
  placeholder = "Select options",
  options = [],
  required = false,
  disabled = false,
  errorText = "",
  helperText = "",
  size = "large",
  allowClear = true,
  showSearch = true,
  maxTagCount = "responsive",
  optionFilterProp = "label",
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
        <Select
          id={id}
          mode="multiple"
          className="multi-select"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          options={options}
          allowClear={allowClear}
          showSearch={showSearch}
          maxTagCount={maxTagCount}
          optionFilterProp={optionFilterProp}
          popupMatchSelectWidth={false}
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

export default MultiSelect;
