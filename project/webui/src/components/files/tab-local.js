import path from 'path';
import {useState, useMemo} from 'react';
import {message, Button, Modal, PageHeader, Spin, Tabs, Tree, TreeSelect} from 'antd';

import {swrFSList} from '../../core/swr';
import {fetchHDFSList, fetchHDFSCopy} from '../../core/api'; 
import {parsePaths} from './utils';
import {createBreadCrumb} from '../common/breadcrumb';

const {TabPane} = Tabs;
const {DirectoryTree} = Tree;

export default function LocalTab({history, setActiveTab}) {
  const [FSFiles, isFSFilesLoading] = swrFSList('/hadoop/host_shared/data');
  const parsedPaths = useMemo(() => FSFiles && parsePaths(FSFiles), [FSFiles]);
  const [selectedNode, selectNode] = useState(null);
  const [enabled, setEnabled] = useState({});
  const [inProgress, setInProgress] = useState({});
  const [copyFileModalVisible, toggleCopyFileModal] = useState(false);
  const [copyTargetPath, setCopyTargetPath] = useState(null);
  const [HDFSFiles, setHDFSFiles] = useState(null);

  const breadcrumb = createBreadCrumb([
    {name:'Files', route:'/files'},
  ]);

  const onSelect = (_, {node}) => {
    setEnabled({copy: node.isLeaf});
    selectNode(node);
  };

  const onExpand = () => {
    setEnabled({});
    selectNode(null);
  };

  const onCopyTargetPathSelect = (_, node) => {
    setCopyTargetPath(node.key)
  };

  const onCopy = async () => {
    toggleCopyFileModal(true);
    const HDFSFiles = await fetchHDFSList('/');
    setHDFSFiles(parsePaths(HDFSFiles, {disableFiles:true})); 
  };

  const copyFile = async () => {
    toggleCopyFileModal(false);
    setInProgress({copy:true});
    const fromPath = selectedNode.key;
    const toPath = path.join(copyTargetPath, selectedNode.title);
    await fetchHDFSCopy(fromPath, toPath);
    message.success('File successfully copied to HDFS!');
    setInProgress({});
  };

  return (
    <PageHeader
      title="Local Files"
      subTitle="File Browser"
      onBack={() => history.goBack()}
      breadcrumb={breadcrumb}
      extra={[
        <Button
          key="copy"
          type="primary"
          loading={inProgress.copy}
          disabled={!enabled.copy}
          onClick={onCopy}
        >
          Copy
        </Button>,
      ]}
    >
      <Tabs defaultActiveKey="Local" tabPosition="left" onTabClick={setActiveTab}>
        <TabPane tab="HDFS" key="HDFS"></TabPane>
        <TabPane tab="Local" key="Local">
          {isFSFilesLoading ?
            <div className="spin-center">
              <Spin size="large" />
            </div>
            :
            <DirectoryTree
              multiple
              expandAction="doubleClick"
              defaultExpandAll
              defaultExpandedKeys={['/']}
              onSelect={onSelect}
              onExpand={onExpand}
              treeData={parsedPaths}
            />
          }
          <Modal
            title="Directory Name"
            visible={copyFileModalVisible}
            onOk={copyFile}
            okButtonProps={{disabled:!HDFSFiles}}
            okText="Copy to HDFS"
            onCancel={() => toggleCopyFileModal(false)}
          > 
            {!HDFSFiles ?
              <div className="spin-center">
                <Spin size="large" />
              </div>
              :
              <TreeSelect
                treeDefaultExpandedKeys={['/']}
                style={{width: '100%'}}
                value={copyTargetPath}
                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                treeData={HDFSFiles}
                placeholder="Please select"
                onSelect={onCopyTargetPathSelect}
              /> 
            }
          </Modal>
        </TabPane>
      </Tabs>
    </PageHeader>
  );
}