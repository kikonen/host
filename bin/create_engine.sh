if [[ "$1" == "" ]]; then
  echo "USAGE"
  echo "$0 [engine_name]"
  exit
fi

# create engine
export ENGINE="gi_${1}"
export USER_GITHUB=kikonen
export USER_NAME="Kari Ikonen"
export USER_EMAIL="mr.kari.ikonen@gmail.com"
export FULL_ENGINE="${ENGINE}_engine"
export GEMSPEC="${FULL_ENGINE}.gemspec"

rails plugin new ${ENGINE} --skip-bundle --skip-test-unit --dummy-path=spec/dummy --mountable
mv ${ENGINE} ${FULL_ENGINE}
cd ${FULL_ENGINE}

# INIT
rm README.rdoc
echo "# ${FULL_ENGINE}" > README.md
git init
git add README.md
git commit -m "INIT"

# Match repo & engine name
mv ${ENGINE}.gemspec ${GEMSPEC}
echo "require_relative '${ENGINE}'" > "lib/${FULL_ENGINE}.rb"

sed -i "s/\"${ENGINE}\"/\"${ENGINE}_engine\"/g" ${GEMSPEC}
sed -i "s/TODO: Your name/${USER_NAME}/g" ${GEMSPEC}
sed -i "s/TODO: Your email/${USER_EMAIL}/g" ${GEMSPEC}
sed -i "s/\"TODO\"/\"https:\/\/github.com\/${USER_GITHUB}\/${FULL_ENGINE}\"/g" ${GEMSPEC}
sed -i "s/\".*TODO.*\"/\"${FULL_ENGINE}\"/g" ${GEMSPEC}
sed -i "s/README.rdoc/README.md/g" ${GEMSPEC}


# setup ruby
echo "2.1.5" > .ruby-version
echo "host" > .ruby-gemset

cat "${FULL_ENGINE}.gemspec"

# post setup
echo "POST SETUP:"
echo "cd ${FULL_ENGINE}"
echo "rvm use ."
echo "bundle"
