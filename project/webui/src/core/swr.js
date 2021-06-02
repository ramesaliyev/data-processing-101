import useSWR from 'swr'

import {ENDPOINTS, fetchAllJobs, fetchJobDetail, fetchStartJob} from './api';

function decorate({data, error}) {
  return [data, !error && !data, error];
}

export function swrAllJobs() {
  return decorate(useSWR(ENDPOINTS.jobList, fetchAllJobs));
}

export function swrJobDetail(uuid) {
  return decorate(useSWR([ENDPOINTS.jobDetail, uuid], () => fetchJobDetail(uuid)));
}