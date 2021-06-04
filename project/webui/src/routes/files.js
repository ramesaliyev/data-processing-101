import {useState} from 'react';

import HDFSTab from '../components/files/tab-hdfs';
import LocalTab from '../components/files/tab-local';

export default function FilesPage(props) {
  const [activeTab, setActiveTab] = useState('HDFS');

  return (
    (activeTab == 'HDFS' && <HDFSTab {...props} setActiveTab={setActiveTab} />) ||
    (activeTab == 'Local' && <LocalTab {...props} setActiveTab={setActiveTab} />)
  );
};