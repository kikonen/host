if defined?(LogRageSetup)
module LogRageSetup
  # @param config Rails app config
  def self.setup(config)
    # @see https://github.com/roidrage/lograge
    config.lograge.custom_options = lambda do |event|
      params = event.payload[:params].reject do |k|
        ['controller', 'action', 'format'].include? k
      end

      { "params" => params }
    end
  end
end
end
