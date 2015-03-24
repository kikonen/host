== README

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
