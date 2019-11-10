ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __dir__)

require 'bundler/setup' # Set up gems listed in the Gemfile.

# No stdout for logger
require 'rack'
require 'rails/command'
require 'rails/commands/server/server_command'

module Rails
  class Server < ::Rack::Server
    alias_method :orig_start, :start

    def start
      orig_start
      options[:log_stdout] = false
    end

    private
    def log_to_stdout
      # No stdout for logger
    end
  end
end
