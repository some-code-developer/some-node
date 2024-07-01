import { useState, useEffect, FC, ChangeEvent } from "react";
import { getErrorMessage } from "@utils/form_utils";

// Components
import { ErrorMessage, Dialogue } from "@shared/index";

interface IInputDialogueProps {
  props: {
    label: string;
    type: string;
    icon: string;
    title: string;
    defaultValue: string;
    onClose: Function;
    onSave: Function;
  };
}

const InputDialogue: FC<IInputDialogueProps> = ({ props }) => {
  const { label, type, icon, title, defaultValue, onClose, onSave } = props;

  const [error, setError] = useState(""); // Overall form error
  const [isValid, setIsValid] = useState(true); // Overall form status
  const [value, setValue] = useState(defaultValue);

  // Close dialogue on escape
  useEffect(() => {
    const closeDialogue = (e: KeyboardEvent) => {
      console.log(e.key);
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

  const onChangeValue = (evt: ChangeEvent<HTMLInputElement>) => {
    setIsValid(true);
    setValue(evt.target.value);
  };

  const onOKClick = async (): Promise<void> => {
    try {
      if (value.length > 0) await onSave(value);
      else setErrorMessage();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const body = (
    <>
      {!isValid && <ErrorMessage props={{ error }} />}
      <div className="container-fluid">
        <label className="form-label form-label-sm" htmlFor="input">
          {label}
        </label>
        <input
          type={type}
          className="mb-1 block w-full rounded-sm border border-gray-300 bg-gray-50 p-1 ps-3 text-sm text-gray-900 focus:z-10 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          defaultValue={defaultValue}
          id="input"
          onChange={onChangeValue}
        />
      </div>
    </>
  );

  const footer = (
    <>
      <button
        className="me-2 ml-auto rounded-md bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        type="button"
        onClick={onOKClick}
      >
        <i className="bi bi-check-lg me-2" />
        OK
      </button>
      <button
        className="rounded-md border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        type="button"
        onClick={() => onClose()}
      >
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
};

export default InputDialogue;
