import { useEffect, FC } from "react";

interface IConfirmDialogueProps {
  props: {
    question: string;
    onOK: Function;
    onCancel: Function;
  };
}

const ConfirmDialogue: FC<IConfirmDialogueProps> = ({ props }) => {
  const {
    question, // form title
    onOK,
    onCancel,
  } = props;

  // Close dialogue on escape or Ctrl + S
  useEffect(() => {
    const closeDialogue = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      // Ctrl + S
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        onOK();
      }
    };

    window.addEventListener("keydown", closeDialogue);
    return () => window.removeEventListener("keydown", closeDialogue);
  }, []);

  return (
    <div
      id="codeModal"
      className="fixed left-0 right-0 top-0 z-50 flex h-screen flex-col items-center justify-center overflow-y-auto overflow-x-hidden"
      role="dialog"
      tabIndex={-1}
    >
      <div className="relative max-h-full w-full max-w-2xl rounded-lg border p-4">
        <div className="mb-1 flex flex-row border-b pb-4 pe-0">
          <h5 className="pt-1">Confirm</h5>
        </div>
        <div className="py-2">{question}</div>
        <div className="flex border-t pt-2">
          <button
            className="me-2 ml-auto rounded-md bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            type="button"
            onClick={() => onOK()}
          >
            <i className="bi bi-check-lg me-2" />
            OK
          </button>
          <button
            className="rounded-md border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            type="button"
            onClick={() => onCancel()}
          >
            <i className="bi bi-arrow-counterclockwise me-2" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialogue;
