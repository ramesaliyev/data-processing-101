import {Badge, Tag} from 'antd';
import {CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, ClockCircleOutlined} from '@ant-design/icons';

import {toCapitalCase} from '../../core/utils';

export default function JobTag({job}) {
  const stateText = toCapitalCase(job.state);

  if (job.done && job.state == 'SUCCEEDED') {
    return <Tag icon={<CheckCircleOutlined />} color="success">{stateText}</Tag>
  } else if (job.state == 'RUNNING') {
    return <Tag icon={<SyncOutlined spin />} color="processing">{stateText}</Tag>
  } else if (job.state == 'FAILED' || job.state == 'KILLED') {
    return <Tag icon={<CloseCircleOutlined />} color="error">{stateText}</Tag>
  }
  
  return <Tag icon={<ClockCircleOutlined />} color="default">{stateText}</Tag>
}

export function JobBadge({job, text}) {
  const stateText = text || toCapitalCase(job.state);

  if (job.done && job.state == 'SUCCEEDED') {
    return <Badge status="success" text={stateText}></Badge>
  } else if (job.state == 'RUNNING') {
    return <Badge status="processing" text={stateText}></Badge>
  } else if (job.state == 'FAILED' || job.state == 'KILLED') {
    return <Badge status="error" text={stateText}></Badge>
  }
  
  return <Badge status="default" text={stateText}></Badge>
}

export function JobKeyTag({job}) {
  const preset = {
    RatingsMean: 'purple',
    RatingsMedian: 'cyan',
    RatingsMode: 'magenta',
    RatingsRange: 'volcano',
    RatingsStandardDeviation: 'geekblue',
  };

  return <Tag color={preset[job.key]}>{job.key}</Tag>;
}