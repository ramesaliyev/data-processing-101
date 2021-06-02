import {useParams} from "react-router-dom";
import {Button, Descriptions, Dropdown, Menu, PageHeader, Spin} from 'antd';
import {EllipsisOutlined} from '@ant-design/icons';

import {swrJobDetail} from '../core/swr';
import {createBreadCrumb} from '../components/breadcrumb';
import JobTag, {JobBadge} from '../components/jobtag'

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

  return (
    <PageHeader
      title={jobDetail.name}
      className="site-page-header"
      subTitle={jobDetail.key}
      onBack={() => history.goBack()}
      breadcrumb={breadcrumb}
      tags={<JobTag job={jobDetail} />}
      extra={[
        <Button key="1">Clone and Run Again</Button>,
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
        <Descriptions.Item label="Input">{jobDetail.input}</Descriptions.Item>
        <Descriptions.Item label="State">
          <JobBadge job={jobDetail} />  
        </Descriptions.Item>
        <Descriptions.Item label="Output">{jobDetail.output}</Descriptions.Item>
      </Descriptions>
    </PageHeader>
  );
}