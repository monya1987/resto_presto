import React from 'react';
import ReactDOM from 'react-dom';
import 'react-toastify/dist/ReactToastify.min.css';
import './index.css';
//import App from './routes/App';
import Root from './Root';
import Store from './store/index';
import * as serviceWorker from './serviceWorker';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

ReactDOM.render(<Root store={new Store()}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
