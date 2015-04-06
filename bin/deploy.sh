. rvm reload
bundle install
RAILS_ENV=production bundle exec rake assets:clobber assets:precompile
service apache2 restart
