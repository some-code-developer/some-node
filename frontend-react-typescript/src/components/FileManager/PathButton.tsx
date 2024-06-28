import { FC } from 'react';

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
    <button type="button" className="btn border" onClick={() => onPathClick(path)}>
      {item}
    </button>
  );
};

export default PathButton;
