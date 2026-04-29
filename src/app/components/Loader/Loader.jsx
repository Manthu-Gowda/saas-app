import React from "react";
import "./Loader.scss";

const Loader = ({ fullScreen = false, size = "md" }) => {
  if (fullScreen) {
    return (
      <div className="loader-overlay">
        <div className={`loader-spinner size-${size}`} />
      </div>
    );
  }
  return (
    <div className="loader-inline">
      <div className={`loader-spinner size-${size}`} />
    </div>
  );
};

export default Loader;
