import {useState, useEffect} from 'react';
import {Drawer, Spin} from 'antd';

import {fetchHDFSRead} from '../../core/api'; 
import VirtualTable from '../lib/virtualtable';

export default function FileContentDrawer({filePath, onClose, isVisible}) {
  const [fileContents, setFileContents] = useState(null);
  const [inProgress, setInProgress] = useState(true);

  useEffect(async () => {
    if (filePath && isVisible) {
      setFileContents(null);
      setInProgress(true);
      const readContent = await fetchHDFSRead(filePath);
      setFileContents(readContent);
      setInProgress(false);
    }
  }, [filePath, isVisible]);

  const onFileDrawerClose = () => {
    onClose();
  };

  return (
    <Drawer
      title={filePath}
      placement="right"
      width={800}
      closable={true}
      onClose={onFileDrawerClose}
      visible={isVisible}
    >
      {inProgress ?
        <div className="spin-center">
          <Spin size="large" />
        </div>
        :
        <VirtualTable
          list={fileContents}
        />
      }
    </Drawer>
  );
}