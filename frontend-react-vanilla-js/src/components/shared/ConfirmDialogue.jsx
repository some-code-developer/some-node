import { useEffect } from "react";

function ConfirmDialogue({ props }) {
  const {
    question, // form title
    onOK,
    onCancel,
  } = props;

  // Close dialogue on escape or Ctrl + S
  useEffect(() => {
    const closeDialogue = (e) => {
      if (e.key === "Escape") onCancel();
      // Ctrl + S
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        onOK();
      }
    };

    window.addEventListener("keydown", closeDialogue);
    return () => window.removeEventListener("keydown", closeDialogue);
  }, []);

  return (
    <div id="codeModal" className="modal" data-bs-backdrop="static" data-bs-keyboard="false" style={{ display: "block" }} role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title">Confirm</div>
          </div>
          <div className="modal-body">
            <div className="p-2 container-fluid">{question}</div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-sm btn-success border border-white me-2" type="button" onClick={onOK}>
              <i className="bi bi-check-lg me-2" />
              OK
            </button>
            <button className="btn btn-sm btn-secondary border border-white text-white me-2" type="button" onClick={onCancel}>
              <i className="bi bi-arrow-counterclockwise me-2" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialogue;
