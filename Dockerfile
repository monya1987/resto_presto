FROM nginx

ENV PCO_IS_BUNDLED=true

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY build/ /etc/nginx/html

ARG NAME=ui
ARG GIT_COMMIT=unknown

LABEL git-commit=${GIT_COMMIT}

CMD /bin/bash -c "envsubst < /etc/nginx/html/js/env_template.js > /etc/nginx/html/js/env.js && nginx -g 'daemon off;'"
