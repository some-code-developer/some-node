import PropTypes from "prop-types";

function CloseButton({ props }) {
  const { onClose } = props;

  return (
    <button
      className="btn btn-sm btn-secondary border border-white text-white me-2"
      type="button"
      onClick={onClose}
    >
      <i className="bi bi-arrow-counterclockwise me-2" />
      Close
    </button>
  );
}

CloseButton.propTypes = {
  props: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
  }),
};

export default CloseButton;
