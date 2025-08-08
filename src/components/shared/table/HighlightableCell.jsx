// Import Dependencies
import PropTypes from "prop-types";

// Local Imports
import { ensureString } from "utils/ensureString";
import { Highlight } from "../Highlight";

// ----------------------------------------------------------------------

export function HighlightableCell({ getValue, table, className = "" }) {
  const query = ensureString(table.getState()?.globalFilter);

  return (
    <span className={className}>
      <Highlight query={query}>{getValue()}</Highlight>
    </span>
  );
}

HighlightableCell.propTypes = {
  getValue: PropTypes.func,
  table: PropTypes.object,
  className: PropTypes.string,
};
