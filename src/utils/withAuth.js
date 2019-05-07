// @flow
import {
  compose,
  branch,
  renderNothing,
  lifecycle,
} from 'recompose';
import queryString from 'query-string';

import {initApi, getToken} from './api';


/**
 * Добавляет авторизацию к приложению. Пока авторизации не инициализируется ничего не отрендерится.
 */

export default compose(
  lifecycle({
    async componentWillMount() {
      const query = queryString.parse(this.props.location.search);
      const token = getToken();
      let isAuthenticated = true;

      if (query.requestToken) {
        await initApi(query.requestToken);
        window.location = window.location.origin;
        isAuthenticated = true;
      } else if (!token) {
        isAuthenticated = false;
        window.location = [
          `${window.env.PCO_ACCOUNTS_ROOT}/oauth/login?`,
          `redirectUrl=${window.location.protocol}//${window.location.host}&`,
          `clientId=${window.env.PCO_CLIENT_ID}&`,
          `display=frame`].join('');
      }
      this.setState({isAuthenticated});
    },
  }),
  branch(
    (props: {isAuthenticated: boolean}) => !props.isAuthenticated,
    renderNothing,
  ),
)
