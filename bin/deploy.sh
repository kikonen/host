if [[ "$1" == "" ]]; then
    echo "USAGE"
    echo "$0 [YYYYMMDD]"
    exit
fi

ROOT_DIR=/home/www/virtual/host.kari.dy.fi
RELEASE="release_${1}"
BRANCH="master"

if [[ "$2" != "" ]]; then
    BRANCH=${2}
fi

function checkExit {
    if [[ $? != 0 ]]; then
        echo "Failed"
        exit
    fi
}

#
# Run command
#
function run {
    echo "RUN: ${1}"
    ${1}
    checkExit
}

#
# clone and checkout branch
#
function checkoutRepository {
    cd /home/www/virtual/host.kari.dy.fi
    git clone git@github.com:kikonen/host.git ${RELEASE}
    checkExit

    cd ${RELEASE}
    checkExit

    # checkout appropriate branch
    git checkout $BRANCH
    checkExit

    git fetch
    checkExit

    git reset --hard "origin/${BRANCH}"
    checkExit
}

#
# setup symlinks
#
function setupSymlinks {
    ln -s "${ROOT_DIR}/shared" shared
    checkExit

    rm -fr public/assets
    ln -s "${ROOT_DIR}/shared/public/assets" public/assets
    checkExit

    rm -fr log
    ln -s "${ROOT_DIR}/shared/log" log
    checkExit

    echo "----------------------------------------"
    echo "root:"
    ls -l
    echo "----------------------------------------"
    echo "public:"
    ls -l public
    echo "----------------------------------------"
}

function setupGems {
    . rvm reload
    . rvm use .
    checkExit

    ruby --version
    rvm gemset list

    bundle install
    checkExit
}

function compileAssets {
    # OPTIONAL: cleanup old compiled assets (careful; breaks running "current" server)
    #RAILS_ENV=production bundle exec rake assets:clobber
    RAILS_ENV=production bundle exec rake assets:precompile
    checkExit
}

function switchCurrent {
    cd ..

    echo "----------------------------------------"
    echo "OLD current:"
    ls -l
    echo "----------------------------------------"

    rm current
    checkExit

    ln -sf ${RELEASE} "current"
    checkExit

    echo "----------------------------------------"
    echo "NEW current:"
    ls -l
    echo "----------------------------------------"
}

function restartApache {
    sudo service apache2 restart
}

echo "RELEASE: ${RELEASE} using ${BRANCH}"

run "checkoutRepository"
run "setupSymlinks"
run "setupGems"
run "compileAssets"
run "switchCurrent"
run "restartApache"
