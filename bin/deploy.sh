. rvm reload
bundle install
RAILS_ENV=production bundle exec rake assets:clobber assets:precompile
sudo service apache2 restart
