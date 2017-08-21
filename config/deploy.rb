# config valid only for current version of Capistrano
lock '3.5.0'

set :rvm_ruby_version, '2.3.1@host'
# this is the money config, it defaults to :system
set :rvm_type, :user

set :application, 'host'
#set :repo_url, 'git@github.com:kikonen/host.git'
set :repo_url, '/home/rails/deploy/host'
set :user, 'rails'
set :deploy_user, "rails"

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
#ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, '/home/www/virtual/host.kari.dy.fi'

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: 'log/capistrano.log', color: :auto, truncate: :auto

set :log_level, :debug

# Default value for :pty is false
#set :pty, true

# Default value for :linked_files is []
# set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')
set :linked_files, %w{config/secrets.yml}

# Default value for linked_dirs is []
# set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'public/system')
set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'public/assets', 'public/system', 'shared')

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

set :keep_assets, 2

namespace :deploy do
  desc "Setup secrets.yml"
  task :secrets do
    on roles(:app) do
      FileUtils.mkdir_p(File.join(shared_path, 'config'))
      secrets_file = File.join(shared_path, 'config', 'secrets.yml')
      if !File.exists?(secrets_file)
        secret = %x(bundle exec rake secret).chomp
        secrets = {
          'production' => {
            'secret_key_base' => secret
          }
        }
        File.open(secrets_file, "w") { |f| f.write secrets.to_yaml }
      end
    end
  end

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end

  desc 'assets:clobber'
  task :assets_clobber do
    on roles(:app) do
      execute "cd #{release_path}; RAILS_ENV=#{fetch(:rails_env)} /opt/ecolane/rails/.rvm/bin/rvm #{fetch(:rvm_ruby_version)} do bundle exec rake assets:clobber"
    end
  end

  # http://stackoverflow.com/questions/14915985/how-do-i-make-nginx-and-passenger-restart-automatically-after-a-deploy
  desc 'deploy:restart'
  task :restart do
    puts "Trigger restart of passenger"
    cmd = "touch #{release_path}/tmp/restart.txt"
    system(cmd)
  end

  desc 'deploy:ping'
  task :ping do
    puts "Pinging the server to ensure Passenger has launched up."
    cmd = "curl -k -L https://host.ikari.fi >/dev/null"
    system(cmd)
  end

  after :publishing, 'deploy:restart'
  after :publishing, 'deploy:ping'
end

before :deploy, "deploy:secrets"
