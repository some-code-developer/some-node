import { FC } from 'react';
import PathButton from './PathButton';

interface IPathToolbarProps {
  props: {
    path: String;
    onPathClick: Function;
  };
}

const PathToolbar: FC<IPathToolbarProps> = ({ props }) => {
  const { path, onPathClick } = props;

  const folders = path ? path.split("/") : [""];

  folders[0] = '/';
  if (folders.length > 1) folders.pop();

  const getPath = (i: number) => {
    const buffer = folders.slice(0, i + 1);
    buffer[0] = '';
    return buffer.join('/');
  };

  return (
    <div className="btn-group btn-group-sm border me-2" role="group">
      {folders &&
        folders.map((item, i) => {
          return <PathButton key={i} props={{ item, path: getPath(i), onPathClick }} />;
        })}
    </div>
  );
};

export default PathToolbar;
