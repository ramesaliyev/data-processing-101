import {Badge, Tag} from 'antd';
import {CheckCircleOutlined, SyncOutlined, CloseCircleOutlined} from '@ant-design/icons';

import {toCapitalCase} from '../core/utils';

export default function JobTag({job}) {
  const stateText = toCapitalCase(job.state);

  if (job.done && job.state == 'SUCCEEDED') {
    return <Tag icon={<CheckCircleOutlined />} color="success">{stateText}</Tag>
  } else if (job.state == 'RUNNING') {
    return <Tag icon={<SyncOutlined spin />} color="processing">{stateText}</Tag>
  }
  
  return <Tag icon={<CloseCircleOutlined />} color="error">{stateText}</Tag>
}

export function JobBadge({job, text}) {
  const stateText = text || toCapitalCase(job.state);

  if (job.done && job.state == 'SUCCEEDED') {
    return <Badge status="success" text={stateText}></Badge>
  } else if (job.state == 'RUNNING') {
    return <Badge status="processing" text={stateText}></Badge>
  }
  
  return <Badge status="error" text={stateText}></Badge>
}