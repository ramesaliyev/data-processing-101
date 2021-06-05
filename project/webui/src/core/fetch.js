import {API_URL} from '../config';

function resolveURL(path) {
  return `${API_URL}${path}`;
}

function fetchUrl(resource, init) {
  return fetch(resource, init)
    .then(res => res.text());
}

export function fetchApi(path) {
  return fetchUrl(resolveURL(path));
}