source 'https://rubygems.org'

gem 'rake', '~> 13.0.0'
gem 'rack', '~> 2.2.0'
gem 'rails', '7.0.2.4'
#gem 'jbuilder'

# NOTE KI REQUIRED in production due to
# Error (undefined method `javascript_pack_tag' for #<ActionView::Base:0x0000000000cb20>
gem 'webpacker', '~> 5.4.0'
#gem 'webpacker', git: 'https://github.com/rails/webpacker'
#gem 'webpacker', git: 'git@github.com:LuanGB/webpacker.git', branch: 'webpacker-clean_with_hashes_on_manifest'

#gem 'bumbler'

gem 'puma'

group :development, :test do
  gem 'listen'
end

gem 'tzinfo-data'

# NOTE KI https://stackoverflow.com/questions/67773514/getting-warning-already-initialized-constant-on-assets-precompile-at-the-time
# --------------------
# /usr/local/lib/ruby/2.7.0/net/protocol.rb:66: warning: already initialized constant Net::ProtocRetryError
# /usr/local/bundle/gems/net-protocol-0.1.3/lib/net/protocol.rb:68: warning: previous definition of ProtocRetryError was here
# /usr/local/lib/ruby/2.7.0/net/protocol.rb:206: warning: already initialized constant Net::BufferedIO::BUFSIZE
# /usr/local/bundle/gems/net-protocol-0.1.3/lib/net/protocol.rb:208: warning: previous definition of BUFSIZE was here
# /usr/local/lib/ruby/2.7.0/net/protocol.rb:503: warning: already initialized constant Net::NetPrivate::Socket
# /usr/local/bundle/gems/net-protocol-0.1.3/lib/net/protocol.rb:504: warning: previous definition of Socket was here
# --------------------
gem "net-http"

# TODO KI pg10 not working
gem 'pg'
#gem 'sqlite3'

gem 'config'
#gem 'jbuilder'

# NOTE KI You have already activated strscan 1.0.3, but your Gemfile requires strscan 3.0.1. Since strscan is a default gem, you can either remove your dependency on it or try updating to a newer version of bundler that supports strscan as a default gem
#gem 'strscan', '~> 1.0.3'

group :development, :test, :deploy do
  gem 'sass-rails' #, '~> 4.0.3'
#  gem 'sassc-rails'
#  gem 'sassc', '2.4.0'
end

# NOTE KI sass not working sprockets 4.0 beta
gem 'sprockets', '~> 4.0'
gem 'sprockets-rails', require: 'sprockets/railtie'

group :development, :test, :deploy do
  gem 'autoprefixer-rails'
  gem 'babel-transpiler'

  gem 'uglifier'
  #gem 'yui-compressor'
end

gem 'bugsnag'

# NOTE KI nokogiri is notorious with library dependencies and horribly slow install
gem 'nokogiri'

#gem 'ngannotate-rails', '>= 1.2.2'
#gem 'ngannotate-rails', git: 'git@github.com:kikonen//ngannotate-rails.git', tag: 'v0.15.4.1b'
#gem 'ngannotate-rails', path: '~/work/projects/ruby/ngannotate-rails'

group :development, :test, :deploy do
  #gem 'therubyracer',  platforms: :ruby
  #gem 'libv8'#, '~> 5.0'
  #gem 'mini_racer'#, '~> 0.1.4'

  # HACK KI due to "mini_racer"
  #gem 'sprockets-babel-miniracer', '>= 0.0.9'
  #gem 'sprockets-babel-miniracer', path: '~/work/projects/ruby/sprockets-babel-miniracer'
end

gem 'ng_template'
#gem 'ng_template', git: 'git@github.com:kikonen//ng_template.git', branch: 'master'
#gem 'ng_template', path: '~/work/projects/ruby/ng_template'

group :development, :test do
#  gem 'pry', '~> 0.10'
  gem 'pry-rails'#, '~> 0.3'
#  gem 'pry-doc', '~> 0.9'
  gem 'pry-byebug', '~> 3.4'
end

group :development do
  gem 'amazing_print'

#  gem 'brakeman', require: false
#  gem 'scss_lint', require: false

  # Updating assets is needed only in development mode
  gem 'bower_vendor'
#  gem 'bower_vendor', path: '~/work/projects/ruby/bower_vendor'
end

gem 'faker'

gem 'oj'
#gem 'ice_nine'

gem 'hamlit'


# faster IO for dalli
# Avoids "IO::EAGAINWaitReadable Resource temporarily unavailable - read would block"
# occurring on every request
gem 'dalli'
gem 'kgio'

# TODO KI discard memcached and use redis for session
gem 'redis'

# http://stackoverflow.com/questions/11580954/resque-vs-sidekiq
# => resque doesn't require thread safety
gem 'resque', '~> 2.2.0'
#gem 'resque-web', require: 'resque_web'

#
# testing
#
group :test do
  gem 'webmock'
  gem 'capybara'
  gem 'capybara-ng'
#  gem 'selenium-webdriver'
  gem 'poltergeist'
#  gem 'capybara-webkit'
  gem 'rspec-rails'
  gem 'factory_girl'
end

# NOTE KI http://docs.travis-ci.com/user/build-configuration/
# - MUST use travis compatible repository access

# NOTE KI deploy using docker *ONLY*
# group :deploy do
#   gem 'capistrano-rails'
#   gem 'capistrano-bundler', '~> 2.0'
#   gem 'capistrano-rvm', '~> 0.1.2'
#   gem 'capistrano-nvm', require: false
#   gem 'capistrano'
#   gem 'capistrano-ext', '~> 1.2'
#   gem 'capistrano-resque', '~> 0.2', require: false
# end

#gem 'gi_test_engine', git: 'git@github.com:kikonen/gi_test_engine.git', branch: 'master'
#gem 'gi_test_engine', path: '~/work/projects/ruby/gi_test_engine'

# TODO KI rmagick gem doesn't compile any longer
#gem 'gi_album_engine', git: 'git@github.com:kikonen/gi_album_engine.git', branch: 'master'
#gem 'gi_album_engine', git: 'git@github.com:kikonen/gi_album_engine.git', branch: 'real_album'
#gem 'gi_album_engine', path: '~/work/projects/ruby/gi_album_engine'

#gem 'gi_raycaster_engine', git: 'git@github.com:kikonen/gi_raycaster_engine.git', branch: 'master'
#gem 'gi_raycaster_engine', path: '~/work/projects/ruby/gi_raycaster_engine'

#gem 'gi_paint_engine', git: 'git@github.com:kikonen/gi_paint_engine.git', branch: 'master'
#gem 'gi_paint_engine', path: '~/work/projects/ruby/gi_paint_engine'
