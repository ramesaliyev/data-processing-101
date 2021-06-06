import {useState, useMemo} from 'react';
import {message, Button, Form, Select, Input, PageHeader, Spin, TreeSelect} from 'antd';

import {swrHDFSList} from '../core/swr';
import {fetchJobStart} from '../core/api';
import {parsePaths} from '../components/files/utils';
import {createBreadCrumb} from '../components/common/breadcrumb';

export default function JobsPage({history}) {
  const [HDFSFiles, isHDFSFilesLoading, isHDFSFilesErrored] = swrHDFSList('/');
  const [inProgress, setInprogress] = useState(false);
  const [form] = Form.useForm();

  const parsedFolders = useMemo(() => HDFSFiles && parsePaths(HDFSFiles, {disableFiles:true}), [HDFSFiles]);
  const parsedFiles = useMemo(() => HDFSFiles && parsePaths(HDFSFiles, {nonSelectableFolders:true}), [HDFSFiles]);

  const breadcrumb = createBreadCrumb([
    {name:'Jobs', route:'/'},
    {name:'New Job', route:`/job/new`}
  ]);

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
    input: '/movielens_test/ratings.csv',
    output: '/movielens_results'
  }

  return (
    <PageHeader
      title="New Job"
      subTitle="Submit New Job"
      onBack={() => history.goBack()}
      breadcrumb={breadcrumb}
    >
      {isHDFSFilesLoading ?
        <div className="spin-center">
          <Spin size="large" />
        </div>
        :
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
            <TreeSelect
              disabled={inProgress}
              treeDefaultExpandedKeys={['/', '/movielens_test']}
              style={{width: '100%'}}
              dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
              treeData={parsedFiles}
              placeholder="Please select input file"
            /> 
          </Form.Item>
          <Form.Item name="output" label="Output Path">
            <TreeSelect
              disabled={inProgress}
              treeDefaultExpandedKeys={['/']}
              style={{width: '100%'}}
              dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
              treeData={parsedFolders}
              placeholder="Please select output folder"
            /> 
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
      }
    </PageHeader>
  )
}