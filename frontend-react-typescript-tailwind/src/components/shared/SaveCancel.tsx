import { FC } from "react";

interface ISaveCancelProps {
  props: {
    onSave: Function;
    onCancel: Function;
  };
}

const SaveCancel: FC<ISaveCancelProps> = ({ props }) => {
  const { onSave, onCancel } = props;
  return (
    <>
      <button
        className="me-2 ml-auto rounded-md bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        type="button"
        onClick={() => onSave()}
      >
        <i className="bi bi-check-lg me-2" />
        Save
      </button>
      <button
        className="rounded-md border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        type="button"
        onClick={() => onCancel()}
      >
        <i className="bi bi-arrow-counterclockwise me-2" />
        Cancel
      </button>
    </>
  );
};

export default SaveCancel;
