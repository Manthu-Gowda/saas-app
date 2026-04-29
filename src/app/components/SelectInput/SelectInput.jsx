import React from "react";
import { Select } from "antd";
import "./SelectInput.scss";

const SelectInput = ({
  title,
  name,
  value,
  onChange,
  placeholder = "Select an option",
  options = [],
  required = false,
  disabled = false,
  errorText = "",
  helperText = "",
  size = "large",
  allowClear = true,
  showSearch = false,
  optionFilterProp = "label",
  onSearch,
  filterOption,
  loading = false,
  notFoundContent,
  onFocus,
  onPopupScroll,
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
          className="select-input"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          options={options}
          allowClear={allowClear}
          showSearch={showSearch}
          optionFilterProp={optionFilterProp}
          popupMatchSelectWidth={false}
          onSearch={onSearch}
          filterOption={filterOption}
          loading={loading}
          notFoundContent={notFoundContent}
          onFocus={onFocus}
          onPopupScroll={onPopupScroll}
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

export default SelectInput;
