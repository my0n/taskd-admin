#!/bin/bash

pushd api
npm run test || exit
popd

node ./api/dist/index.js &

/entrypoint.sh $@ &

echo "waiting 15 seconds so services can start up"

sleep 15

pushd integration
npm run test || exit
popd
