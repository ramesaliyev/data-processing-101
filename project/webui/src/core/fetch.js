const PORT = 4567;

function resolveURL(path) {
  return `http://localhost:${PORT}${path}`;
}

function fetchUrl(resource, init) {
  return fetch(resource, init)
    .then(res => res.text());
}

export function fetchApi(path) {
  return fetchUrl(resolveURL(path));
}