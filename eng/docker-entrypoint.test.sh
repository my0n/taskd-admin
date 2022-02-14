#!/bin/bash
pushd api
npm run test
popd
pushd web
npm run test
popd
