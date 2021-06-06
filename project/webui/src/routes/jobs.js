import {Button, Empty, List, PageHeader, Spin, Space} from 'antd';
import {PlusOutlined} from '@ant-design/icons';

import {swrAllJobs} from '../core/swr';
import {createBreadCrumb} from '../components/common/breadcrumb';
import JobTag, {JobKeyTag} from '../components/job/jobtag'

function JobsPageHeader({children}) {
  return (
    <PageHeader
      title="Jobs"
      subTitle="MapReduce Jobs"
      breadcrumb={createBreadCrumb([{name:'Jobs', route:'/'}])}
      extra={[
        <Button
          href="/job/new"
          key="new-job"
          type="primary"
          icon={<PlusOutlined />}
        >
          New Job
        </Button>
      ]}
    >
      {children}
    </PageHeader>
  );
}

function JobsList({jobList, isJobListLoading, isJobListErrored}) {
  if (isJobListLoading) {
    return (
      <div className="spin-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!jobList || !jobList.length) {
    <Space size="large">
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : 
    </Space>
  }

  return (
    <List
      size="large"
      bordered
      dataSource={jobList}
      renderItem={item =>
        <List.Item
          className="no-tag-margin"
          actions={[
            <JobKeyTag job={item} />,
            <JobTag job={item} />,
          ]}
        >
          <a href={'/job/'+ item.uuid}>{item.name}</a>
        </List.Item>
      }
    />
  );
}

export default function JobsPage() {
  const [jobList, isJobListLoading, isJobListErrored] = swrAllJobs();

  return (
    <JobsPageHeader>
      <JobsList
        jobList={jobList}
        isJobListLoading={isJobListLoading}
        isJobListErrored={isJobListErrored}
      />
    </JobsPageHeader>
  )
}