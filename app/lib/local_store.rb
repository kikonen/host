# frozen_string_literal: true

#
# Local cache for request
#
class LocalStore
  def initialize(app)
    @app = app
  end

  def call(env)
    LocalStore.clear
    @app.call(env)
  ensure
    LocalStore.clear
  end

  def self.store
    Thread.current[:local_store] ||= {}
  end

  def self.clear
    Thread.current[:local_store]&.clear
  end
end
