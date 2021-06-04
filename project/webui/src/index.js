import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import {SWRConfig} from 'swr'

import FilesPage from './routes/files';
import JobsPage from './routes/jobs';
import JobDetailPage from './routes/job-detail';
import JobCreatePage from './routes/job-create';

import 'react-virtualized/styles.css';
import 'antd/dist/antd.css';
import './index.css';

const fetcher = (resource, init) =>
  fetch(resource, init).then(res => res.text());

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <SWRConfig value={{refreshInterval: 5000, fetcher}}>
          <Switch>
            <Route path="/job/new" component={JobCreatePage}></Route>
            <Route path="/job/:uuid" component={JobDetailPage}></Route>
            <Route path="/files" component={FilesPage}></Route>
            <Route path="/" component={JobsPage}></Route>
          </Switch>
        </SWRConfig>
      </div>
    </BrowserRouter>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);