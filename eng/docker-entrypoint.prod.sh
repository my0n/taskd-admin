#!/bin/bash

if [[ $TASKD_ADMIN_ENABLED -eq 1 ]]
then

    # taskd-admin
    node ./api/dist/index.js &

    # taskd
    /entrypoint.sh $@ &

    # exit on first fail
    wait -n

    exit $?

else

    # taskd
    /entrypoint.sh $@

fi
