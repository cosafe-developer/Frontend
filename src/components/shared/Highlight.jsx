// Import Dependencies
import clsx from "clsx";
import { Fragment } from "react";
import PropTypes from "prop-types";

// Local Imports
import { useHighlight } from "hooks";

// ----------------------------------------------------------------------

export function Highlight({
  children = "",
  query,
  unstyled = false,
  highlightClass,
}) {

  const safeText =
    typeof children === "string" || typeof children === "number"
      ? children.toString()
      : "";

  const chunks = useHighlight({
    query,
    text: safeText,
  });

  return (
    <>
      {chunks.map((chunk, index) =>
        chunk.match ? (
          <mark
            key={index}
            className={clsx(
              "whitespace-nowrap",
              !unstyled &&
              "inline-block rounded-xs bg-lime-200 dark:bg-lime-300",
              highlightClass,
            )}
          >
            {chunk.text}
          </mark>
        ) : (
          <Fragment key={index}>{chunk.text}</Fragment>
        )
      )}
    </>
  );
}

Highlight.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  query: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
  unstyled: PropTypes.bool,
  highlightClass: PropTypes.string,
};
