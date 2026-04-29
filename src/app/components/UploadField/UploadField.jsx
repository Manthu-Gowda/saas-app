import React from "react";
import { Upload, Button } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import "./UploadField.scss";

const UploadField = ({
  title,
  required = false,
  errorText = "",
  helperText = "",
  fileList,
  onChange,
  onRemove,
  accept,
  multiple = false,
  maxCount = 1,
  disabled = false,
  dragger = false,
  beforeUpload = () => false, // prevent auto upload
  listType = "text", // "text" | "picture" | "picture-card" | "picture-circle"
  id,
}) => {
  const hasError = Boolean(errorText);

  const uploadProps = {
    fileList,
    onChange,
    onRemove,
    accept,
    multiple,
    maxCount,
    disabled,
    beforeUpload,
    listType,
  };

  return (
    <div className={`upload-field ${hasError ? "has-error" : ""}`}>
      {title && (
        <span className="input-label">
          {title}
          {required && <span className="required-asterisk"> *</span>}
        </span>
      )}

      <div className="upload-container">
        {dragger ? (
          <Upload.Dragger id={id} {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: "#6c47ff" }} />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              {accept
                ? `Supports: ${accept}`
                : "Support for a single or bulk upload"}
            </p>
          </Upload.Dragger>
        ) : (
          <Upload id={id} {...uploadProps}>
            <Button icon={<UploadOutlined />} disabled={disabled}>
              Select File
            </Button>
          </Upload>
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

export default UploadField;
