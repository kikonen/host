#!/bin/bash

sudo chown -R docker:users /bundle /node_modules /app/log /app/tmp /app/public

# NOTE KI *NEW* intance clear old trash
rm /app/tmp/pids/server.pid

bundle exec rails s -b 0.0.0.0 -p 3000
