import { FC } from 'react';

interface IErrorMessage {
  props: {
    error: string;
  };
}

const ErrorMessage: FC<IErrorMessage> = ({ props }) => {
  const { error } = props;
  return (
    <div className="alert alert-danger mt-2" role="alert">
      <strong>{error}</strong>
    </div>
  );
};

export default ErrorMessage;
