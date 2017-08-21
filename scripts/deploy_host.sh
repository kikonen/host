DEPLOY_DIR=~/deploy/host
BRANCH_TAG=$1
if [[ $BRANCH_TAG == '' ]]; then
    echo "USAGE: $0 [branch_or_tag]"
    echo "EXAMPLE: $0 origin/master"
    echo "EXAMPLE: $0 tag_x"
    exit
fi

echo "BRANCH_TAG: ${BRANCH_TAG}"

cd $DEPLOY_DIR
pwd
git fetch
git checkout -b production 2> /dev/null
git checkout production && git reset --hard $BRANCH_TAG && cd .

git --no-pager log -2

# resolve proper ruby version (requires rvm reload)
RUBY_VERSION=`head .ruby-version`
RUBY_GEMSET=`head .ruby-gemset`
if [[ $RUBY_VERSION == '' ]]; then
    echo "missing .ruby-version"
    exit
fi
if [[ $RUBY_GEMSET == '' ]]; then
    echo "missing .ruby-gemset"
    exit
fi
RVM_RUBY="${RUBY_VERSION}@${RUBY_GEMSET}"

rvm $RUBY_VERSION do rvm gemset create $RUBY_GEMSET
source "$HOME/.rvm/scripts/rvm" && rvm use $RVM_RUBY
ruby --version
rvm gemset list

echo "DEPLOY: ${RVM_RUBY} - ${BRANCH_TAG}"

rvm "${RUBY_VERSION}@global" do gem install --no-ri --no-rdoc bundler
bundle install --without development test
#cap production deploy && sudo service nginx restart
cap production deploy
echo "DONE! installed ${RVM_RUBY} - ${BRANCH_TAG}"
