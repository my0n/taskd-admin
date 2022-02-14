#!/bin/bash

# taskd-admin
node ./api/dist/index.js &

# taskd
/entrypoint.sh $@ &

# exit on first fail
wait -n

exit $?
