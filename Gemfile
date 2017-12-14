source 'https://rubygems.org'

gem 'rake', '~> 10.4.2'
gem 'rack', '2.0.1'
gem 'rails', '5.1.3'
#gem 'jbuilder'

gem 'pg'
gem 'sqlite3'

gem 'config'
gem 'jbuilder'

#gem 'sass-rails', '~> 4.0.3'
gem 'sassc-rails', '~> 1.3.0'
gem 'autoprefixer-rails', '~> 6.5'

# NOTE KI sass not working sprockets 4.0 beta
gem 'sprockets', '>= 3.6', '< 4.0'

gem 'uglifier', '~> 3.0'
gem 'yui-compressor'

# NOTE KI nokogiri is notorious with library dependencies and horribly slow install
gem 'nokogiri', '~> 1.7.0'

gem 'ngannotate-rails', '>= 1.2.2'
#gem 'ngannotate-rails', git: 'git@github.com:kikonen//ngannotate-rails.git', tag: 'v0.15.4.1b'
#gem 'ngannotate-rails', path: '~/work/projects/ruby/ngannotate-rails'

#gem 'therubyracer',  platforms: :ruby
gem 'libv8', '~> 5.0'
gem 'mini_racer', '~> 0.1.4'

# HACK KI due to "mini_racer"
gem 'sprockets-babel-miniracer', '>= 0.0.9'
#gem 'sprockets-babel-miniracer', path: '~/work/projects/ruby/sprockets-babel-miniracer'

gem 'typescript-rails', '~> 0.6'

gem 'ng_template'
#gem 'ng_template', git: 'git@github.com:kikonen//ng_template.git', branch: 'master'
#gem 'ng_template', path: '~/work/projects/ruby/ng_template'

group :development do
  gem 'pry', '~> 0.10'
  gem 'pry-rails', '~> 0.3'
  gem 'pry-doc', '~> 0.9'
  gem 'pry-byebug', '~> 3.4'
end

group :development do
#  gem 'thin'
  gem 'awesome_print', '~> 1.7'

#  gem 'brakeman', require: false
  gem 'scss_lint', require: false

  # Updating assets is needed only in development mode
  gem 'bower_vendor'
#  gem 'bower_vendor', path: '~/work/projects/ruby/bower_vendor'
end

gem 'oj', '~> 2.17'
gem 'ice_nine'

gem 'hamlit', '~> 2.7'


# faster IO for dalli
# Avoids "IO::EAGAINWaitReadable Resource temporarily unavailable - read would block"
# occurring on every request
gem 'dalli'
gem 'kgio'

# http://stackoverflow.com/questions/11580954/resque-vs-sidekiq
# => resque doesn't require thread safety
gem 'resque', '~> 1.26'
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

group :deploy do
  gem 'capistrano-rails', '~> 1.1.3'
  gem 'capistrano-bundler', '~> 1.1'
  gem 'capistrano-rvm', '~> 0.1.2'
  gem 'capistrano', '~> 3.5.0'
  gem 'capistrano-ext', '~> 1.2'
  gem 'capistrano-resque', '~> 0.2', require: false
end

gem 'gi_test_engine', git: 'git@github.com:kikonen/gi_test_engine.git', branch: 'master'
#gem 'gi_test_engine', path: '~/work/projects/ruby/gi_test_engine'

gem 'gi_album_engine', git: 'git@github.com:kikonen/gi_album_engine.git', branch: 'master'
#gem 'gi_album_engine', git: 'git@github.com:kikonen/gi_album_engine.git', branch: 'real_album'
#gem 'gi_album_engine', path: '~/work/projects/ruby/gi_album_engine'

gem 'gi_raycaster_engine', git: 'git@github.com:kikonen/gi_raycaster_engine.git', branch: 'master'
#gem 'gi_raycaster_engine', path: '~/work/projects/ruby/gi_raycaster_engine'

gem 'gi_paint_engine', git: 'git@github.com:kikonen/gi_paint_engine.git', branch: 'master'
#gem 'gi_paint_engine', path: '~/work/projects/ruby/gi_paint_engine'
