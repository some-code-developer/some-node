import { FC } from 'react';
import FileManager from '../components/FileManager';

const Page: FC = () => {
  return <FileManager props={{ path: '/' }} />;
};

export default Page;
