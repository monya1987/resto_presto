// @flow
import queryString from 'query-string';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

export function getToken(): string {
  return localStorage.getItem('access_token') || '';
}

function onApiError(error: {status: number}) {
  if (error.status === 401) {
    localStorage.removeItem('access_token');
    window.location.reload();
  }
}

export function initApi(requestToken: string) {
  return fetch(`${window.env.PCO_AUTH_ROOT}/auth/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      code: requestToken,
      "redirect_uri": `${window.location.protocol}//${window.location.host}`,
      "client_id": window.env.PCO_CLIENT_ID
    })
  })
    .then((response: Response) => response.json())
    .then((json: {access_token: string}) => {
      localStorage.setItem('access_token', json.access_token);
    })
}

export default class Api {
  headers = {
    ...headers,
    'Authorization': `Bearer ${getToken()}`,
  };

  get(url: string, query?: {}, baseUrl: string = window.env.PCO_API_ROOT) {
    let link = `${baseUrl}${url}?${queryString.stringify(query)}`;

    if (baseUrl === window.env.PCO_AUTH_ROOT) {
      this.headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    }

    return fetch(link, {
      method: 'GET',
      headers: this.headers,
    }).then((response: Response) => {
      const totalCount = response.headers.get('total-count');

      return response.json().then((json: {}) => {
        onApiError(response);
        return response.ok ? {data: json, totalCount: totalCount ? +totalCount : 0} : Promise.reject(json);
      });
    }).catch(onApiError);
  }

  post(url: string, body: {}, baseUrl: string = window.env.PCO_API_ROOT) {
    const link = `${baseUrl}${url}`;

    return fetch(link, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body)
    }).then((response: Response) => {
      return response.json().then((json: {}) => {
        onApiError(response);
        return response.ok ? json : Promise.reject(json);
      });
    }).catch(onApiError)
  }

  put(url: string, body: {}, baseUrl: string = window.env.PCO_API_ROOT) {
    const link = `${baseUrl}${url}`;

    return fetch(link, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(body)
    }).then((response: Response) => {
      return response.json().then((json: {}) => {
        onApiError(response);
        return response.ok ? json : Promise.reject(json);
      });
    })
  }
}