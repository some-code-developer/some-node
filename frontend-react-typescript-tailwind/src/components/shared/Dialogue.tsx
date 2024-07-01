import { FC, ReactElement } from "react";

interface IDialogueProps {
  props: {
    id: string;
    isLoading?: boolean;
    icon: string;
    title: string;
    toolbar?: ReactElement;
    body: ReactElement;
    footer: ReactElement;
    onClose: Function;
  };
}

const Dialogue: FC<IDialogueProps> = ({ props }) => {
  const { id, isLoading, icon, title, toolbar, body, footer, onClose } = props;

  if (isLoading) return null;

  return (
    <div
      id={id}
      key={id}
      className="fixed left-0 right-0 top-0 z-50 flex h-screen flex-col items-center justify-center overflow-y-auto overflow-x-hidden"
      role="dialog"
      tabIndex={-1}
    >
      <div className="relative max-h-full w-full max-w-2xl rounded-lg border p-4">
        <div className="mb-1 flex flex-row border-b pb-4 pe-0">
          <div className="flex-fill flex">
            <i className={`${icon} mr-3 pt-1`} />
            <h5 className="pt-1">{title}</h5>
          </div>
          <div className="ml-auto">
            {toolbar}
            <button
              type="button"
              title="Close dialogue"
              className="mr-1 border border-gray-200 bg-white px-1 py-1 text-sm text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-gray-700 focus:ring-1 focus:ring-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
              aria-label="Close"
              onClick={() => onClose()}
            >
              <i className="bi-x-lg" />
            </button>
          </div>
        </div>
        <div>{body}</div>
        <div className="flex border-t pt-2">{footer}</div>
      </div>
    </div>
  );
};

export default Dialogue;
