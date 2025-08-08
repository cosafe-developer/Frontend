// Import Dependencies
import PropTypes from "prop-types";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Feather Icons

// ----------------------------------------------------------------------

export function PasswordCell({ getValue }) {
  const value = getValue?.();
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible((prev) => !prev);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span>{visible ? value : "*".repeat(String(value || "").length)}</span>
      <button
        type="button"
        onClick={toggleVisibility}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        {visible ? (
          <FiEyeOff size={16} />
        ) : (
          <FiEye size={16} />
        )}
      </button>
    </div>
  );
}

PasswordCell.propTypes = {
  getValue: PropTypes.func.isRequired,
};
