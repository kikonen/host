if [[ "$1" == "" ]]; then
  echo "USAGE"
  echo "$0 [engine_name]"
  exit
fi

# create engine
BASE_NAME=${1}
export ENGINE="gi_${BASE_NAME}"
export USER_GITHUB=kikonen
export USER_NAME="Kari Ikonen"
export USER_EMAIL="mr.kari.ikonen@gmail.com"
export FULL_ENGINE="${ENGINE}_engine"
export GEMSPEC="${FULL_ENGINE}.gemspec"
export ENGINE_MODULE=`echo ${BASE_NAME} | ruby -e "puts 'Gi' + STDIN.read.split('_').map { |p| p[0].upcase + p[1, p.length]}.join('')"`

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
echo -e "\nclass ${ENGINE_MODULE}::Engine\n  def self.mount_path\n    \"#{parent.name.underscore}\"\n  end\nend" >>  "lib/${ENGINE}/engine.rb"

# rename engine files for sensibility
mv "app/assets/stylesheets/${ENGINE}/application.css" "app/assets/stylesheets/${ENGINE}/engine.css"
mv "app/assets/javascripts/${ENGINE}/application.js" "app/assets/javascripts/${ENGINE}/engine.js"

mv "app/controllers/${ENGINE}/application_controller.rb" "app/controllers/${ENGINE}/engine_controller.rb"
mv "app/helpers/${ENGINE}/application_helper.rb" "app/helpers/${ENGINE}/engine_helper.rb"

rm "app/views/layouts/${ENGINE}/application.html.erb"
cp ../host/templates/engine.html.erb "app/views/layouts/${ENGINE}/engine.html.erb"

sed -i "s/ActionController::Base/::BaseController/g" "app/controllers/${ENGINE}/engine_controller.rb"
sed -i "s/Application/Engine/g" "app/controllers/${ENGINE}/engine_controller.rb"
sed -i "s/Application/Engine/g" "app/helpers/${ENGINE}/engine_helper.rb"
sed -i "s/application/engine/g" "app/assets/stylesheets/${ENGINE}/engine.css"
sed -i "s/application/engine/g" "app/assets/javascripts/${ENGINE}/engine.js"
sed -i "s/ENGINE_NAME/${ENGINE}/g" "app/views/layouts/${ENGINE}/engine.html.erb"


# setup ruby
echo "2.1.5" > .ruby-version
echo "host" > .ruby-gemset

# show generated data
echo ""
echo "${FULL_ENGINE}.gemspec"
echo "------------------------------"
cat "${FULL_ENGINE}.gemspec"
echo "------------------------------"

# bind to host
HOST_ROUTES="host/config/routes.rb"
HOST_GEMFILE="host/Gemfile"
cd ..

echo "" >> ${HOST_ROUTES}
echo "Rails.application.routes.draw do" >> ${HOST_ROUTES}
echo "  mount ${ENGINE_MODULE}::Engine, at: ${ENGINE_MODULE}::Engine.mount_path" >> ${HOST_ROUTES}
echo "end" >> ${HOST_ROUTES}

echo "" >> ${HOST_GEMFILE}
echo "gem '${FULL_ENGINE}', git: 'git@github.com:${USER_GITHUB}/${FULL_ENGINE}.git', branch: 'master'" >> ${HOST_GEMFILE}
echo "#gem '${FULL_ENGINE}', path: '~/work/projects/ruby/${FULL_ENGINE}'" >> ${HOST_GEMFILE}

# show generated data
echo ""
echo "host/Gemfile:"
echo "------------------------------"
tail -3 host/Gemfile
echo "------------------------------"
echo ""
echo "host/config/routes.rb"
echo "------------------------------"
tail -4 host/config/routes.rb
echo "------------------------------"

# post setup
echo ""
echo "POST SETUP:"
echo "cd ${FULL_ENGINE}"
echo "rvm use ."
echo "bundle"
