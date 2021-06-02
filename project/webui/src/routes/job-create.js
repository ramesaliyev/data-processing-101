import {Button, Form, Select, Input, PageHeader} from 'antd';

import {callStartJob} from '../core/api';
import {createBreadCrumb} from '../components/breadcrumb';

export default function JobsPage({history}) {
  const [form] = Form.useForm();

  const onFormChange = async ({name, key, input, output}) => {
    if (name && key && input && output) {
      const uuid = await callStartJob(name, key, input, output);
      history.push(`/job/${uuid}`);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  const initialValues = {
    input: '/movielens/ratings.csv',
    output: '/movielensresults'
  }

  const breadcrumb = createBreadCrumb([
    {name:'Jobs', route:'/'},
    {name:'New Job', route:`/job/new`}
  ]);

  return (
    <PageHeader
      title="New Job"
      className="site-page-header"
      subTitle="Submit New Job"
      onBack={() => history.goBack()}
      breadcrumb={breadcrumb}
    >
      <>
      <Form
        form={form} 
        onFinish={onFormChange}
        wrapperCol={{span: 14}}
        layout="vertical"
        initialValues={initialValues}
        size={'default'}
      >
        <Form.Item name="key" label="Job">
          <Select placeholder="Select a Job">
            <Select.Option value="RatingsMean">RatingsMean</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="name" label="Name">
          <Input placeholder="Enter a Job Name" />
        </Form.Item>
        <Form.Item name="input" label="Input File">
          <Input />
        </Form.Item>
        <Form.Item name="output" label="Output Path">
          <Input />
        </Form.Item>
        <Form.Item label="" colon={false}>
          <Button type="primary" htmlType="submit" style={{marginRight:'8px'}}>
            Submit
          </Button>
          <Button htmlType="reset" onClick={onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </>
    </PageHeader>
  )
}