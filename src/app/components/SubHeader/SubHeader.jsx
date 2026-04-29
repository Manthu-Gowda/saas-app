import React from "react";
import PropTypes from "prop-types";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import "./SubHeader.scss";

const SubHeader = ({
  title,
  subTitle = "",
  showBack = true,
  onBack,
  showRight = false,
  onRightClick,
  rightActionLabel = "Action",
  rightActionIcon = null,
  divider = true,
  compact = false,
  children,
}) => {
  const rootClasses = [
    "subheader",
    divider ? "subheader--divider" : "",
    compact ? "subheader--compact" : "",
  ]
    .join(" ")
    .trim();

  return (
    <div className={rootClasses}>
      <div className="subheader__left">
        <div className="subheader__titleRow">
          {showBack && (
            <button
              type="button"
              className="subheader__back"
              aria-label="Go back"
              onClick={onBack}
            >
              ←
            </button>
          )}
          <div>
            <h2 className="subheader__title">{title}</h2>
            {subTitle && (
              <div className="subheader__subtitle">{subTitle}</div>
            )}
          </div>
        </div>
      </div>

      <div className="subheader__right">
        {children && (
          <div className="subheader__center">{children}</div>
        )}
        {showRight && onRightClick && (
          <ButtonComponent
            variant="primary"
            onClick={onRightClick}
            icon={rightActionIcon}
            size="md"
          >
            {rightActionLabel}
          </ButtonComponent>
        )}
      </div>
    </div>
  );
};

SubHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.node,
  showBack: PropTypes.bool,
  onBack: PropTypes.func,
  showRight: PropTypes.bool,
  onRightClick: PropTypes.func,
  rightActionLabel: PropTypes.string,
  rightActionIcon: PropTypes.node,
  divider: PropTypes.bool,
  compact: PropTypes.bool,
  children: PropTypes.node,
};

export default SubHeader;
