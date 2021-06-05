import {useState} from 'react';
import {message, Button, Form, Select, Input, PageHeader} from 'antd';

import {fetchJobStart} from '../core/api';
import {createBreadCrumb} from '../components/breadcrumb';

export default function JobsPage({history}) {
  const [inProgress, setInprogress] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async ({name, key, input, output}) => {
    if (name && key && input && output) {
      setInprogress(true);
      const uuid = await fetchJobStart(name, key, input, output);
      message.success('Job succesfully created!');
      history.push(`/job/${uuid}`);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  const initialValues = {
    input: '/movielenstest/ratings.csv',
    output: '/movielenstestresults'
  }

  const breadcrumb = createBreadCrumb([
    {name:'Jobs', route:'/'},
    {name:'New Job', route:`/job/new`}
  ]);

  return (
    <PageHeader
      title="New Job"
      subTitle="Submit New Job"
      onBack={() => history.goBack()}
      breadcrumb={breadcrumb}
    >
      <>
      <Form
        form={form} 
        onFinish={onFinish}
        wrapperCol={{span: 14}}
        layout="vertical"
        initialValues={initialValues}
        size={'default'}
      >
        <Form.Item name="key" label="Job">
          <Select placeholder="Select a Job" disabled={inProgress}>
            <Select.Option value="RatingsMean">RatingsMean</Select.Option>
            <Select.Option value="RatingsMedian">RatingsMedian</Select.Option>
            <Select.Option value="RatingsMode">RatingsMode</Select.Option>
            <Select.Option value="RatingsRange">RatingsRange</Select.Option>
            <Select.Option value="RatingsStandardDeviation">RatingsStandardDeviation</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="name" label="Name">
          <Input placeholder="Enter a Job Name" disabled={inProgress} />
        </Form.Item>
        <Form.Item name="input" label="Input File">
          <Input disabled={inProgress} />
        </Form.Item>
        <Form.Item name="output" label="Output Path">
          <Input disabled={inProgress} />
        </Form.Item>
        <Form.Item label="" colon={false}>
          <Button type="primary" htmlType="submit" loading={inProgress} style={{marginRight:'8px'}}>
            Submit
          </Button>
          <Button htmlType="reset" onClick={onReset} disabled={inProgress}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </>
    </PageHeader>
  )
}