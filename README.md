# Usage

```
docker run -d --name taskd-admin \
  -p 8080:8080 \
  -v $PWD/taskd:/var/taskd \
  ghcr.io/my0n/taskd-admin:latest
```