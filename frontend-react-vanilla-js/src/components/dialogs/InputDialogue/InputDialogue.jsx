import { useState, useEffect } from "react";
import { getErrorMessage } from "@utils/form_utils";
// Components
import { ErrorMessage, Dialogue } from "@shared/index";

export function InputDialogue({ props }) {
  const { label, type, icon, title, defaultValue, onClose, onSave } = props;

  const [error, setError] = useState(""); // Overall form error
  const [isValid, setIsValid] = useState(true); // Overall form status
  const [value, setValue] = useState(defaultValue);

  // Close dialogue on escape
  useEffect(() => {
    const closeDialogue = (e) => {
      if (e.key === "Escape") onClose();
      // Ctrl + S
      if (e.ctrlKey && e.key === "s") {
        onOKClick();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", closeDialogue);
    return () => window.removeEventListener("keydown", closeDialogue);
  }, [value]);

  const setErrorMessage = () => {
    setIsValid(false);
    setError(`Please enter the ${label}`);
  };

  const onChangeValue = async (evt) => {
    setIsValid(true);
    setValue(evt.target.value);
  };

  const onOKClick = async () => {
    try {
      if (value.length > 0) await onSave(value);
      else setErrorMessage();
    } catch (err) {
      setIsValid(false);
      setError(getErrorMessage(err));
    }
  };

  const body = (
    <>
      <div className="container-fluid">{!isValid && <ErrorMessage props={{ error }} />}</div>
      <div className="container-fluid">
        <div className="row mb-3">
          <div className="col">
            <label className="form-label form-label-sm" htmlFor="input">
              {label}
            </label>
            <input type={type} className="form-control form-control-sm" defaultValue={defaultValue} id="input" onChange={onChangeValue} />
          </div>
        </div>
      </div>
    </>
  );

  const footer = (
    <>
      <button className="btn btn-sm btn-success border border-white me-2" type="button" onClick={onOKClick}>
        <i className="bi bi-check-lg me-2" />
        OK
      </button>
      <button className="btn btn-sm btn-secondary border border-white text-white me-2" type="button" onClick={onClose}>
        <i className="bi bi-arrow-counterclockwise me-2" />
        Cancel
      </button>
    </>
  );

  return (
    <Dialogue
      props={{
        id: "InputModal",
        icon,
        title,
        body,
        footer,
        onClose,
      }}
    />
  );
}
