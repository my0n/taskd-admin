FROM node:16-alpine as node

FROM x4121/taskd:v0.2.0 as base
COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/share /usr/local/share
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin
RUN apk add --no-cache bash

# api
WORKDIR /taskd-admin/api
COPY ./api/package*.json ./
RUN npm ci
COPY ./api/src ./src
COPY ./api/jest.config.js ./jest.config.js
COPY ./api/tsconfig.json ./tsconfig.json
RUN npm run build

FROM base as test
WORKDIR /taskd-admin
COPY ./eng/docker-entrypoint.test.sh ./entrypoint.sh
ENTRYPOINT [ "./entrypoint.sh" ]
CMD [ "taskd", "server" ]

FROM base as prod
WORKDIR /taskd-admin
COPY ./eng/docker-entrypoint.prod.sh ./entrypoint.sh
EXPOSE 8080
ENTRYPOINT [ "./entrypoint.sh" ]
CMD [ "taskd", "server" ]
