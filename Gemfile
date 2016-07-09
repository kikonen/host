source 'https://rubygems.org'

gem 'rake', '~> 10.4.2'
gem 'rails', '>= 4.2.0', '< 5.0'
gem 'jbuilder'

gem 'pg'
gem 'sqlite3'

gem 'config'

gem 'sass-rails', '~> 4.0.3'
gem 'autoprefixer-rails'

gem 'uglifier', '>= 1.3.0'
gem 'ngannotate-rails'
#gem 'ngannotate-rails', git: 'git://github.com/kikonen/ngannotate-rails.git', tag: 'v0.15.4.1b'
#gem 'ngannotate-rails', path: '~/work/projects/ruby/ngannotate-rails'

#gem 'therubyracer',  platforms: :ruby
gem 'libv8', '~> 5.0'
gem 'mini_racer', '~> 0.1.4'

# HACK KI due to "mini_racer"
gem 'sprockets-babel-miniracer', '>= 0.0.9'
#gem 'sprockets-babel-miniracer', path: '~/work/projects/ruby/sprockets-babel-miniracer'

gem 'ng_template'
#gem 'ng_template', git: 'git://github.com/kikonen/ng_template.git', branch: 'master'
#gem 'ng_template', path: '~/work/projects/ruby/ng_template'

#gem 'logging-rails'
#gem 'lograge'

group :development do
  gem 'thin'
  gem 'pry'
  gem 'pry-rails'
  gem 'pry-doc'
  gem 'pry-byebug'
  gem 'awesome_print'

  gem 'brakeman', require: false
end

gem 'oj'
#gem 'hashie'

#
# testing
#
group :test do
  gem 'webmock'
  gem 'capybara'
  gem 'capybara-ng'
  gem 'selenium-webdriver'
  gem 'poltergeist'
  gem 'capybara-webkit'
  gem 'rspec-rails'
end

# NOTE KI http://docs.travis-ci.com/user/build-configuration/
# - MUST use travis compatible repository access

group :development do
  # Updating assets is needed only in development mode
  gem 'bower_vendor'
#gem 'bower_vendor', git: 'git://github.com/kikonen/bower_vendor.git', branch: 'master'
#gem 'bower_vendor', path: '~/work/projects/ruby/bower_vendor'
end

gem 'gi_test_engine', git: 'git://github.com/kikonen/gi_test_engine.git', branch: 'master'
#gem 'gi_test_engine', path: '~/work/projects/ruby/gi_test_engine'

gem 'gi_album_engine', git: 'git://github.com/kikonen/gi_album_engine.git', branch: 'real_album'
#gem 'gi_album_engine', path: '~/work/projects/ruby/gi_album_engine'

gem 'gi_raycaster_engine', git: 'git://github.com/kikonen/gi_raycaster_engine.git', branch: 'master'
#gem 'gi_raycaster_engine', path: '~/work/projects/ruby/gi_raycaster_engine'

gem 'gi_paint_engine', git: 'git://github.com/kikonen/gi_paint_engine.git', branch: 'painter'
#gem 'gi_paint_engine', path: '~/work/projects/ruby/gi_paint_engine'
