#!/bin/bash

#socat TCP-LISTEN:11211,fork TCP:memcached:11211 &
#socat TCP-LISTEN:6379,fork TCP:redis:6379 &

sudo chown -R docker:users /bundle /node_modules /app/log /app/tmp /app/public

# NOTE KI *NEW* intance clear old trash
rm /app/tmp/pids/server.pid

echo "SERVER_MODE: $SERVER_MODE"

if [[ "$SERVER_MODE" == "debug" ]]; then
    sleep infinity
else
    bundle check || bundle install
    bundle exec rails s -b 0.0.0.0 -p 3000
fi
