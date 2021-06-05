import {useParams} from "react-router-dom";
import {useState} from 'react';
import {message, Button, Descriptions, Dropdown, Menu, PageHeader, Spin} from 'antd';
import {EllipsisOutlined} from '@ant-design/icons';

import {fetchJobStart} from '../core/api';
import {swrJobDetail} from '../core/swr';
import {getJobCloneDetails} from '../core/utils';
import {createBreadCrumb} from '../components/breadcrumb';
import JobTag, {JobBadge} from '../components/jobtag'
import FileContentDrawer from '../components/files/file-content-drawer';

const JobOptionsDropdown = () => (
  <Dropdown
    key="more"
    overlay={
      <Menu>
        <Menu.Item>
          Delete Job
        </Menu.Item>
      </Menu>
    }
  >
    <Button style={{border: 'none', padding: 0}}>
      <EllipsisOutlined style={{fontSize: 20, verticalAlign: 'top'}} />
    </Button>
  </Dropdown>
);

export default function JobDetailPage({history}) {
  const {uuid} = useParams();
  const [jobDetail, isJobDetailLoading, isJobDetailErrored] = swrJobDetail(uuid);
  const [selectedFilePath, setSelectedFilePath] = useState(null);
  const [cloningInProgress, setCloningInProgress] = useState(false);

  if (isJobDetailLoading || !jobDetail) {
    return (
      <div className="spin-center">
        <Spin size="large" />
      </div>
    );
  }

  const breadcrumb = createBreadCrumb([
    {name:'Jobs', route:'/'},
    {name:jobDetail.name, route:`/job/${uuid}`}
  ]);

  const onFileDrawerClose = () => {
    setSelectedFilePath(null);
  };

  const cloneAndRunAgain = async () => {
    setCloningInProgress(true);
    const cloneJob = getJobCloneDetails(jobDetail);
    const uuid = await fetchJobStart(cloneJob.name, cloneJob.key, cloneJob.input, cloneJob.output);
    setCloningInProgress(false);
    message.success('Job succesfully cloned and started!');
    history.push(`/job/${uuid}`);
  };  

  return (
    <PageHeader
      title={jobDetail.name}
      subTitle={jobDetail.key}
      onBack={() => history.goBack()}
      breadcrumb={breadcrumb}
      tags={<JobTag job={jobDetail} />}
      extra={[
        <Button 
          onClick={cloneAndRunAgain}
          loading={cloningInProgress}
          key="clone"
        >
          Clone and Run Again
        </Button>,
        <JobOptionsDropdown key="more" />
      ]}
    >
      <Descriptions bordered size="small" column={2} labelStyle={{fontWeight:'bold'}}>
        <Descriptions.Item label="Name">{jobDetail.name}</Descriptions.Item>
        <Descriptions.Item label="UUID">{jobDetail.uuid}</Descriptions.Item>
        <Descriptions.Item label="Key">{jobDetail.key}</Descriptions.Item>
        <Descriptions.Item label="Created">{new Date(jobDetail.createdAt).toString()}</Descriptions.Item>
        <Descriptions.Item label="Completed">
          <JobBadge job={jobDetail} text={jobDetail.done ? 'True' : 'False'} />  
        </Descriptions.Item>
        <Descriptions.Item label="Input">
          <a onClick={() => setSelectedFilePath(jobDetail.input)}>
            {jobDetail.input}
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="State">
          <JobBadge job={jobDetail} />  
        </Descriptions.Item>
        <Descriptions.Item label="Output">
          <a onClick={() => setSelectedFilePath(`${jobDetail.output}/part-r-00000`)}>
            {jobDetail.output}/part-r-00000
          </a>
        </Descriptions.Item>
      </Descriptions>
      <FileContentDrawer
        filePath={selectedFilePath}
        onClose={onFileDrawerClose}
        isVisible={selectedFilePath}
      />
    </PageHeader>
  );
}