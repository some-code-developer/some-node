import { MouseEventHandler, FC } from 'react';

interface ICloseButtonProps {
  props: {
    onClose: MouseEventHandler;
  };
}

const CloseButton: FC<ICloseButtonProps> = ({ props }) => {
  const { onClose } = props;

  return (
    <button className="btn btn-sm btn-secondary border border-white text-white me-2" type="button" onClick={onClose}>
      <i className="bi bi-arrow-counterclockwise me-2" />
      Close
    </button>
  );
};

export default CloseButton;
