import {useParams} from "react-router-dom";
import {useState} from 'react';
import {message, Button, Descriptions, Popconfirm, PageHeader, Spin} from 'antd';

import {fetchJobStart, fetchJobRemove} from '../core/api';
import {swrJobDetail} from '../core/swr';
import {getJobCloneDetails} from '../core/utils';
import {createBreadCrumb} from '../components/breadcrumb';
import JobTag, {JobBadge} from '../components/jobtag'
import FileContentDrawer from '../components/files/file-content-drawer';

export default function JobDetailPage({history}) {
  const {uuid} = useParams();
  const [jobDetail, isJobDetailLoading, isJobDetailErrored] = swrJobDetail(uuid);
  const [selectedFilePath, setSelectedFilePath] = useState(null);
  const [cloningInProgress, setCloningInProgress] = useState(false);
  const [removingInProgress, setRemovingInProgress] = useState(false);

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

  const removeJob = async () => {
    setRemovingInProgress(true);
    await fetchJobRemove(jobDetail.uuid);
    setRemovingInProgress(false);
    message.success('Job succesfully removed!');
    history.push(`/jobs`);
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
          ghost
          disabled={removingInProgress || !jobDetail.done}
          onClick={cloneAndRunAgain}
          loading={cloningInProgress}
          key="clone"
          type="primary"
        >
          Clone and Run Again
        </Button>,
        <Popconfirm
          key="remove"
          placement="bottom"
          onConfirm={removeJob}
          title="Are you sure to delete this job?"
          okText="Yes"
          cancelText="No"
        >
          <Button
            danger
            type="dashed"
            disabled={cloningInProgress || !jobDetail.done}
            loading={removingInProgress}
          >
            Delete
          </Button>
        </Popconfirm>
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
          {(jobDetail.done && jobDetail.state == 'SUCCEEDED') ?
            <a onClick={() => setSelectedFilePath(`${jobDetail.output}/part-r-00000`)}>
              {jobDetail.output}/part-r-00000
            </a>
            :
            "-"
          }
          
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