# Set up gems listed in the Gemfile.
ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../../Gemfile', __FILE__)

require 'bundler/setup' if File.exist?(ENV['BUNDLE_GEMFILE'])

require 'rails/commands/server'

# No stdout for logger
module Rails
  class Server < ::Rack::Server
    class Options
      alias_method :orig_parse, :parse!

      def parse!(args)
        options = orig_parse(args)
        options[:log_stdout] = false
        options
      end
    end
  end
end
