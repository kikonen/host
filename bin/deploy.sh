if [[ "$1" == "" ]]; then
  echo "USAGE"
  echo "$0 [YYYYMMDD]"
  exit
fi
ROOT_DIR=/home/www/virtual/host.kari.dy.fi
RELEASE="release_${1}"

cd /home/www/virtual/host.kari.dy.fi
git clone git@github.com:kikonen/host.git ${RELEASE}
cd ${RELEASE}

ln -s "${ROOT_DIR}/shared" shared

rm -fr public/assets
ln -s "${ROOT_DIR}/shared/public/assets" public/assets

rm -fr log
ln -s "${ROOT_DIR}/shared/log" log

ls -l
ls -l public

. rvm reload
bundle install

# OPTIONAL: cleanup old compiled assets (careful; breaks running "current" server)
#RAILS_ENV=production bundle exec rake assets:clobber
RAILS_ENV=production bundle exec rake assets:precompile

cd ..
rm "current"
ln -sf ${RELEASE} "current"

sudo service apache2 restart
