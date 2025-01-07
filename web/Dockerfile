FROM node:20 AS ui-builder
WORKDIR /app
COPY ./app/package.json .
COPY ./app/yarn.lock .
RUN yarn
COPY ./app .

RUN yarn build

FROM nginx:alpine
RUN apk add bash --no-cache
COPY nginx.conf /etc/nginx/nginx.conf
COPY ./substitute-env.sh .
COPY --from=ui-builder ./app/build /app

ENV ENV_CONFIG="./app/env-config.js"

ENTRYPOINT ["bash", "substitute-env.sh"]
CMD ["nginx"]
