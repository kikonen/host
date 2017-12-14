# README

## Setup

- NVM expected
** https://github.com/creationix/nvm

- RVM required
** https://rvm.io/rvm/install

```bash
nvm use
npm install bower
npm install typescript-node

# NOTE KI notorious nokogiri workaround
NOKOGIRI_USE_SYSTEM_LIBRARIES=true bundle
```
## START

```bash
rails s -b 0.0.0.0 -p 3000
```

## Assets

Test assets
```bash
  bundle exec rake assets:clobber
  ASSETS=true NG_FORCE=true RAILS_ENV=development bundle exec rake assets:precompile
  ASSETS=true rails s -p 3000
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
