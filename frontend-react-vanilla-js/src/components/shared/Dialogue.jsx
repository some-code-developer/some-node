// Hooks
import { useStickyState } from "@hooks/index";

function Dialogue({ props }) {
  const { id, isLoading, icon, title, toolbar, body, footer, onClose, onMaximizedChanged } = props;

  const [maximized, setMaximized] = useStickyState(false, id);

  const onMaximizedClick = () => {
    setMaximized(!maximized);
    if (onMaximizedChanged) onMaximizedChanged(!maximized);
  };

  if (isLoading) return null;

  return (
    <div
      id={id}
      key={id}
      style={{ display: "block" }}
      className="modal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      role="dialog"
      tabIndex="-1"
    >
      <div className={`modal-dialog ${maximized ? "modal-fullscreen" : "modal-dialog-scrollable modal-dialog-centered modal-xl"}`}>
        <div className="modal-content">
          <div className="modal-header">
            <div className="d-flex flex-row">
              <i className={`${icon} pt-1 me-3`} />
              <h5 className="modal-title">{title}</h5>
            </div>
            <div className="ml-auto d-flex flex-row">
              {toolbar}
              <button type="button" className="btn btn-sm" title="Maximize" aria-label="Maximize" onClick={onMaximizedClick}>
                <i className="bi bi-arrows-fullscreen" />
              </button>
              <button type="button" title="Close dialogue" className="btn btn-sm me-0" aria-label="Close" onClick={onClose}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
          </div>
          <div className="modal-body">{body}</div>
          <div className="modal-footer">{footer}</div>
        </div>
      </div>
    </div>
  );
}

export default Dialogue;
