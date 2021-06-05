import path from 'path';
import {useState, useMemo} from 'react';
import {message, Button, Input, Modal, PageHeader, Popconfirm, Spin, Tabs, Tree} from 'antd';

import {swrHDFSList} from '../../core/swr';
import {fetchHDFSMkdir, fetchHDFSRemove} from '../../core/api'; 
import {parsePaths} from './utils';
import {createBreadCrumb} from '../breadcrumb';
import FileContentDrawer from './file-content-drawer';

const {TabPane} = Tabs;
const {DirectoryTree} = Tree;

export default function HDFSTab({history, setActiveTab}) {
  const [HDFSFiles, isHDFSFilesLoading, isHDFSFilesErrored, refetchHDFSFiles] = swrHDFSList('/');
  const parsedPaths = useMemo(() => HDFSFiles && parsePaths(HDFSFiles), [HDFSFiles]);
  const [selectedNode, selectNode] = useState(null);
  const [inProgress, setInProgress] = useState({});
  const [enabled, setEnabled] = useState({});
  const [mkdirModalVisible, toggleMkdirModal] = useState(false);
  const [newDirName, setNewDirName] = useState('');
  const [fileDrawerVisible, toggleFileDrawer] = useState(false);

  const breadcrumb = createBreadCrumb([
    {name:'Files', route:'/files'},
  ]);

  const onSelect = (_, {node}) => {
    setEnabled({
      open: node.isLeaf,
      mkdir: !node.isLeaf,
      delete: true,
    });

    selectNode(node);
  };

  const onExpand = () => {
    setEnabled({});
    selectNode(null);
  };

  const onOpen = async () => {
    toggleFileDrawer(true);
  };

  const onFileDrawerClose = () => {
    toggleFileDrawer(false);
  };

  const onDelete = async () => {
    setInProgress({delete: true});
    await fetchHDFSRemove(selectedNode.key);
    refetchHDFSFiles();
    message.success('File successfully deleted!');
    selectNode(null);
    setInProgress({});
    setEnabled({});
  };

  const onMkdir = async () => {
    setInProgress({mkdir: true});
    toggleMkdirModal(false);
    await fetchHDFSMkdir(path.join(selectedNode.key, newDirName));
    refetchHDFSFiles();
    message.success('Directory successfully created!');
    setInProgress({});
    setNewDirName('');
  };

  return (
    <PageHeader
      title="Files"
      subTitle="Local and HDFS Files"
      onBack={() => history.goBack()}
      breadcrumb={breadcrumb}
      extra={[
        <Button
          key="1"
          type="primary"
          disabled={!enabled.open}
          onClick={onOpen}
        >
          Open
        </Button>,
        <Button
          key="2"
          loading={inProgress.mkdir}
          disabled={!enabled.mkdir}
          onClick={() => toggleMkdirModal(true)}
        >
          New Directory</Button>,
        <Popconfirm
          key="3"
          placement="bottom"
          onConfirm={onDelete}
          title="Are you sure to delete this path?"
          okText="Yes"
          cancelText="No"
        >
          <Button
            danger
            loading={inProgress.delete}
            disabled={!enabled.delete}
          >
            Delete
          </Button>
        </Popconfirm>
      ]}
    >
      <Tabs defaultActiveKey="1" tabPosition="left" onTabClick={setActiveTab}>
        <TabPane tab="HDFS" key="HDFS">
          {isHDFSFilesLoading ?
            <div className="spin-center">
              <Spin size="large" />
            </div>
            :
            <DirectoryTree
              multiple
              expandAction="doubleClick"
              defaultExpandedKeys={['/']}
              onSelect={onSelect}
              onExpand={onExpand}
              treeData={parsedPaths}
            />
          }
          <Modal
            title="Directory Name"
            visible={mkdirModalVisible}
            onOk={onMkdir}
            okText="Create Directory"
            onCancel={() => toggleMkdirModal(false)}
          >
            <Input value={newDirName} placeholder="Input directory name" onChange={e => setNewDirName(e.target.value)} />
          </Modal>
          <FileContentDrawer
            filePath={selectedNode && selectedNode.key}
            onClose={onFileDrawerClose}
            isVisible={fileDrawerVisible}
          />
        </TabPane>
        <TabPane tab="Local" key="Local"></TabPane>
      </Tabs>
    </PageHeader>
  );
}