# frozen_string_literal: true

module Secret
  @cache = {}

  def self.[](key)
    @cache[key] ||= begin
      filename = "/var/run/secrets/#{key}"
      File.read(filename).chomp if File.exist?(filename)
    end
  end
end
