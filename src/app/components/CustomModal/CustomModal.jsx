import React from "react";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import "./CustomModal.scss";

const CustomModal = ({
  open,
  title = "",
  children,
  onClose,
  showPrimary = true,
  showDanger = true,
  primaryText = "Confirm",
  dangerText = "Cancel",
  onPrimary,
  onDanger,
  primaryProps = {},
  dangerProps = {},
  width = 520,
  centered = true,
  maskclosable = false,
  destroyOnHidden = true,
  footerAlign = "right",  // "left" | "center" | "right"
  className = "",
  bodyClassName = "",
  closable = true,
}) => {
  const handleDanger = onDanger || onClose;

  return (
    <Modal
      open={open}
      width={width}
      centered={centered}
      maskclosable={maskclosable}
      destroyOnHidden={destroyOnHidden}
      footer={null}
      closable={false}
      onCancel={onClose}
      className={`appModal ${className}`}
    >
      <div className="appModal__header">
        <h3 className="appModal__title">{title}</h3>
        {closable && (
          <button
            type="button"
            className="appModal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseOutlined />
          </button>
        )}
      </div>

      <div className={`appModal__body ${bodyClassName}`}>{children}</div>

      {(showPrimary || showDanger) && (
        <div className={`appModal__footer is-${footerAlign}`}>
          {showDanger && (
            <ButtonComponent
              variant="ghost"
              onClick={handleDanger}
              {...dangerProps}
            >
              {dangerText}
            </ButtonComponent>
          )}
          {showPrimary && (
            <ButtonComponent
              variant="primary"
              onClick={onPrimary}
              {...primaryProps}
            >
              {primaryText}
            </ButtonComponent>
          )}
        </div>
      )}
    </Modal>
  );
};

export default CustomModal;
