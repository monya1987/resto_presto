// @flow
import React from 'react';
import { Provider } from 'mobx-react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';

import {Loader} from './components';

const EventsPage = Loadable({
  loader: () => import('./routes/Events/Events'),
  loading: () => <Loader/>
});

const AlarmListPage = Loadable({
  loader: () => import('./routes/AlarmList/AlarmList'),
  loading: () => <Loader/>
});

const Root = ({ store }: { store: {}}) => (
  <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route key="home" exact path="/" component={EventsPage}/>
            <Route key="event" exact path="/object/:id" component={AlarmListPage}/>
          </Switch>
        </BrowserRouter>
  </Provider>
);

export default Root;
