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

# setup gemspec
sed -i "s/\"${ENGINE}\"/\"${ENGINE}_engine\"/g" ${GEMSPEC}
sed -i "s/TODO: Your name/${USER_NAME}/g" ${GEMSPEC}
sed -i "s/TODO: Your email/${USER_EMAIL}/g" ${GEMSPEC}
sed -i "s/\"TODO\"/\"https:\/\/github.com\/${USER_GITHUB}\/${FULL_ENGINE}\"/g" ${GEMSPEC}
sed -i "s/\".*TODO.*\"/\"${FULL_ENGINE}\"/g" ${GEMSPEC}
sed -i "s/README.rdoc/README.md/g" ${GEMSPEC}

# setup mounting
echo -e "\nclass GiTest::Engine\n  def self.mount_path\n    \"#{parent.name.underscore}\"\n  end\nend" >>  "lib/${ENGINE}/engine.rb"

# rename engine files for sensibility
mv "app/assets/stylesheets/${ENGINE}/application.css" "app/assets/stylesheets/${ENGINE}/engine.css"
mv "app/assets/javascripts/${ENGINE}/application.js" "app/assets/javascripts/${ENGINE}/engine.js"

mv "app/controllers/${ENGINE}/application_controller.rb" "app/controllers/${ENGINE}/engine_controller.rb"
mv "app/helpers/${ENGINE}/application_helper.rb" "app/helpers/${ENGINE}/engine_helper.rb"
mv "app/views/layouts/${ENGINE}/application.html.erb" "app/views/layouts/${ENGINE}/engine.html.erb"

sed -i "s/ActionController::Base/::BaseController/g" "app/controllers/${ENGINE}/engine_controller.rb"
sed -i "s/Application/Engine/g" "app/controllers/${ENGINE}/engine_controller.rb"
sed -i "s/Application/Engine/g" "app/helpers/${ENGINE}/engine_helper.rb"
sed -i "s/application/engine/g" "app/assets/stylesheets/${ENGINE}/engine.css"
sed -i "s/application/engine/g" "app/assets/javascripts/${ENGINE}/engine.js"
sed -i "s/application/engine/g" "app/views/layouts/${ENGINE}/engine.html.erb"


# setup ruby
echo "2.1.5" > .ruby-version
echo "host" > .ruby-gemset

cat "${FULL_ENGINE}.gemspec"

# post setup
echo "POST SETUP:"
echo "cd ${FULL_ENGINE}"
echo "rvm use ."
echo "bundle"
