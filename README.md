# taskd-admin

taskd-admin is an admin API wrapper around [x4121's taskd docker container](https://github.com/x4121/docker-taskd). It hosts both taskd and the API server in one container, and exposes HTTP endpoints so that you don't need to exec into the container to configure users.

This only supports a slice of what taskd can do, and is otherwise fairly thrown together - I set out to implement only what I use, but PRs are more than appreciated.

# Usage

Example docker command:

```
docker run -d --name taskd-admin \
  -p 8080:8080 \
  -p 53589:53589 \
  -v $PWD/taskd:/var/taskd \
  -e CERT_CN="taskd" \
  -e CERT_ORGANIZATION="some org" \
  -e CERT_COUNTRY="DE" \
  -e CERT_STATE="Bavaria" \
  -e CERT_LOCALITY="Munich" \
  -e TASKD_ADMIN_ENABLED=1 \
  -e TASKD_ADMIN_USER="myuser" \
  -e TASKD_ADMIN_PASS="mypass" \
  ghcr.io/my0n/taskd-admin:latest
```

Environment variables specific to taskd-admin:

| Name | Default | Description |
| ---- | ------- | ----------- |
| `TASKD_ADMIN_ENABLED` | `""` | Enable the taskd-admin REST API? 1 = yes. Defaults to no. |
| `TASKD_ADMIN_USER` | `"admin"` | Admin username for the REST API. |
| `TASKD_ADMIN_PASS` | `"password"` | Admin password for the REST API. |

Endpoints for the REST API (all endpoints require a basic authorization header using the configured `TASKD_ADMIN_USER` and `TASKD_ADMIN_PASS`):

| Endpoint | Description |
| -------- | ----------- |
| `GET /ca.cert.pem` | Get the automatically generated ca.cert.pem |
| `GET /orgs` | Get the list of orgs |
| `GET /orgs/:org/users` | Get the list of users in a given org |
| `GET /orgs/:org/users/:uuid/cert.pem` | Get the automatically generated cert.pem for this user |
| `GET /orgs/:org/users/:uuid/key.pem` | Get the automatically generated key.pem for this user |
| `POST /orgs { name: "myOrg" }` | Create a new org with the name "myOrg" |
| `POST /orgs/:org/users { name: "myUser" }` | Create a new user with the name "myUser" |

# Development

Only run unit tests on the API:

```
cd api
npm run test
```

Run unit tests and integration tests in the docker environment:

```
docker build -t local . --target=test
docker run --rm local
```
