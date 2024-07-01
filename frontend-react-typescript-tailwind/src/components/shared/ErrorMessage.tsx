import { FC } from 'react';

interface IErrorMessage {
  props: {
    error: string;
  };
}

const ErrorMessage: FC<IErrorMessage> = ({ props }) => {
  const { error } = props;
  return (
    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
      <strong>{error}</strong>
    </div>
  );
};

export default ErrorMessage;
