import { useState, useEffect, ChangeEvent, FC } from "react";

// Components
import { ErrorMessage, SaveCancel, Dialogue } from "@shared/index";

interface IUploadDialogueProps {
  props: {
    extension: string;
    onClose: Function;
    onSave: Function;
  };
}
const UploadDialogue: FC<IUploadDialogueProps> = ({ props }) => {
  const { extension, onClose, onSave } = props;

  const [error, setError] = useState(""); // Overall form error
  const [isValid, setIsValid] = useState(true); // Overall form status

  const [formData, setFormData] = useState<unknown>(); // File

  // Close dialogue on escape
  useEffect(() => {
    const closeDialogue = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Ctrl + S
      if (e.ctrlKey && e.key === "s") {
        onOKClick();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", closeDialogue);
    return () => window.removeEventListener("keydown", closeDialogue);
  }, [formData]);

  const setErrorMessage = () => {
    setIsValid(false);
    setError("Please select the file");
  };

  const onChangeFile = async (evt: ChangeEvent<HTMLInputElement>) => {
    setIsValid(true);
    if (!evt.target.files) {
      setErrorMessage();
      return;
    }
    const data = new FormData();
    data.append("file", evt.target.files[0]);
    data.append("fileName", evt.target.files[0].name);
    setFormData(data);
  };

  const onOKClick = () => {
    if (formData) onSave(formData);
    else setErrorMessage();
  };

  const body = (
    <>
      {!isValid && <ErrorMessage props={{ error }} />}
      <input
        type="file"
        id="fu"
        accept={extension}
        onChange={onChangeFile}
        className="block w-full rounded-sm border border-gray-300 bg-gray-50 p-1 ps-3 text-sm text-gray-900 focus:z-10 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      />
    </>
  );

  const footer = (
    <SaveCancel props={{ onSave: onOKClick, onCancel: onClose }} />
  );

  return (
    <Dialogue
      props={{
        id: "UploadModal",
        icon: "bi-cloud-upload",
        title: `Upload file (${extension})`,
        body,
        footer,
        onClose,
      }}
    />
  );
};

export default UploadDialogue;
