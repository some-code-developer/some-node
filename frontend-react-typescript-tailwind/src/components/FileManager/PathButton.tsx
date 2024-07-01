import { FC } from "react";

interface IPathButtonProps {
  props: {
    item: string;
    path: string;
    onPathClick: Function;
  };
}

const PathButton: FC<IPathButtonProps> = ({ props }) => {
  const { item, path, onPathClick } = props;
  return (
    <button
      type="button"
      className="mr-1 rounded-sm border border-gray-200 bg-white px-4 py-1 text-sm text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-gray-700 focus:ring-1 focus:ring-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
      onClick={() => onPathClick(path)}
    >
      {item}
    </button>
  );
};

export default PathButton;
