. rvm reload
bundle install
# OPTIONAL: cleanup old compiled assets (careful; breaks running "current" server)
#RAILS_ENV=production bundle exec rake assets:clobber
RAILS_ENV=production bundle exec rake assets:precompile
sudo service apache2 restart
