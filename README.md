# README

## Assets

Test assets
```bash
  ASSETS=true NG_FORCE=true RAILS_ENV=development bundle exec rake assets:clobber assets:precompile
  ASSETS=true rails s -p 3010
```

Cleanup
```bash
  bundle exec rake assets:clobber
```

## Development

### Create new engine

[create_engine.sh](bin/create_engine.sh)

```bash
host/bin/create_engine.sh xxx
```

## Demo

Live demo running this server

http://host.kari.dy.fi
