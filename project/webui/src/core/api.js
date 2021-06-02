import orderBy from 'lodash/orderBy';
import {fetchApi} from './fetch';

export const ENDPOINTS = {
  jobList: '/job/list',
  jobDetail: '/job/info',
  jobStart: '/job/start',
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

export async function fetchAllJobs() {
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

export async function callStartJob(name, key, input, output) {
  const uuid = await fetchApi(ENDPOINTS.jobStart + `?name=${name}&key=${key}&input=${input}&output=${output}`);
  return uuid.trim();
}