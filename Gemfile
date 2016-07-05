source 'https://rubygems.org'

gem 'rake', '~> 10.4.2'
gem 'rails', '~> 4.1.10'
gem 'jbuilder'

gem 'pg'
gem 'sqlite3'

gem 'sass-rails', '~> 4.0.3'
gem 'autoprefixer-rails'

gem 'uglifier', '>= 1.3.0'
gem 'ngannotate-rails'
#gem 'ngannotate-rails', git: 'git://github.com/kikonen/ngannotate-rails.git', tag: 'v0.15.4.1b'
#gem 'ngannotate-rails', path: '~/work/projects/ruby/ngannotate-rails'

#gem 'therubyracer',  platforms: :ruby
gem 'libv8', '~> 5.0'
gem 'mini_racer', '~> 0.1.4'

# ES6 transpiling
#gem 'sprockets-traceur', '0.0.4'
#gem 'traceur-rb', '0.0.4'

#gem 'sprockets-babel', '0.0.6'
# HACK KI due to "mini_racer"
gem 'sprockets-babel', git: 'https://github.com/kikonen/sprockets-babel.git', tag: '0.0.6.2'
#gem 'sprockets-babel', path: '~/work/projects/ruby/sprockets-babel'

# See https://github.com/sstephenson/execjs#readme for more supported runtimes
gem 'execjs',  platforms: :ruby

gem 'ng_template', '~> 0.1.0'
#gem 'ng_template', git: 'git://github.com/kikonen/ng_template.git', branch: 'master'
#gem 'ng_template', path: '~/work/projects/ruby/ng_template'

gem 'logging-rails'
gem 'lograge'

group :development do
  gem 'thin'
  gem 'pry'
  gem 'awesome_print'
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
