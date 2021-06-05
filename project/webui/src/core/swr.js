import useSWR from 'swr'

import {
  ENDPOINTS,
  fetchJobsAll,
  fetchJobDetail,
  fetchHDFSList,
  fetchFSList,
} from './api';

function decorate({data, error, mutate}) {
  return [data, !error && !data, error, mutate];
}

export function swrAllJobs() {
  return decorate(useSWR(ENDPOINTS.jobList, fetchJobsAll));
}

export function swrJobDetail(uuid) {
  return decorate(useSWR([ENDPOINTS.jobDetail, uuid], () => fetchJobDetail(uuid)));
}

export function swrHDFSList(path) {
  return decorate(useSWR([ENDPOINTS.hdfsList, path], () => fetchHDFSList(path)));
}

export function swrFSList(path) {
  return decorate(useSWR([ENDPOINTS.fsList, path], () => fetchFSList(path)));
}