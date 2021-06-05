import orderBy from 'lodash/orderBy';
import {fetchApi} from './fetch';

export const ENDPOINTS = {
  fsList: '/fs/list',
  hdfsMkdir: '/hdfs/mkdir',
  hdfsCopy: '/hdfs/copy',
  hdfsList: '/hdfs/list',
  hdfsRead: '/hdfs/read',
  hdfsRemove: '/hdfs/remove',
  jobList: '/job/list',
  jobDetail: '/job/info',
  jobStart: '/job/start',
  jobRemove: '/job/remove',
};

export async function fetchJobDetail(uuid) {
  const jobDetailResponse = await fetchApi(ENDPOINTS.jobDetail + `?uuid=${uuid}`);
  const jobDetailLines = jobDetailResponse.split('\n');
  const jobDetail = {};

  if (jobDetailLines.length) {
    for (const line of jobDetailLines) {
      if (line.length) {
        const [key, value] = line.split(':');
        jobDetail[key] = value;
      }
    }

    // Fix some types.
    jobDetail.done = jobDetail.done === 'true';
    jobDetail.createdAt = +jobDetail.createdAt;
  }

  return jobDetail;
}

export async function fetchJobsAll() {
  const jobListResponse = await fetchApi(ENDPOINTS.jobList);
  const jobList = jobListResponse.split('\n').reverse();
  let jobDetails = [];

  if (jobList.length) {
    for (const uuid of jobList) {
      if (uuid.length) {
        jobDetails.push(await fetchJobDetail(uuid));
      }
    }

    jobDetails = orderBy(jobDetails, ['createdAt'], ['desc']);
  }

  return jobDetails;
}

export async function fetchJobStart(name, key, input, output) {
  const uuid = await fetchApi(
    ENDPOINTS.jobStart +
    `?name=${name}&key=${key}&input=${input}&output=${output}`
  );

  return uuid.trim();
}

export async function fetchJobRemove(uuid) {
  return await fetchApi(ENDPOINTS.jobRemove + `?uuid=${uuid}`);
}

export async function fetchHDFSMkdir(path) {
  return await fetchApi(ENDPOINTS.hdfsMkdir + `?path=${path}`);
}

export async function fetchHDFSCopy(from, to) {
  return await fetchApi(ENDPOINTS.hdfsCopy + `?from=${from}&to=${to}`);
}

export async function fetchHDFSRead(path) {
  const result = await fetchApi(ENDPOINTS.hdfsRead + `?path=${path}`)
    
  return result.split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}

export async function fetchHDFSList(path) {
  const responseText = await fetchApi(ENDPOINTS.hdfsList + `?path=${path}`);
  
  const paths = responseText
    .split('\n')
    .map(path => path.trim())
    .filter(Boolean);
  
  return paths;
}

export async function fetchHDFSRemove(path) {
  return await fetchApi(ENDPOINTS.hdfsRemove + `?path=${path}`);
}

export async function fetchFSList(path) {
  const responseText = await fetchApi(ENDPOINTS.fsList + `?path=${path}`);
  
  const paths = responseText
    .split('\n')
    .filter(path => !path.split('/').pop().trim().startsWith('.'))
    .filter(Boolean)
  
  return paths;
}