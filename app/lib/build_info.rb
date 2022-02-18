module BuildInfo
  BUILD_INFO_FILE = File.join(Rails.root, "docker", "build_info.json")

  def self.build_info
    @build_info ||= begin
      { build_tag: ENV['BUILD_TAG'] || 'na' }.merge!(read_build_info)
    end
  end

  def self.read_build_info
    if File.exists?(BUILD_INFO_FILE)
      data = File.read(BUILD_INFO_FILE)
      JSON.parse(data).symbolize_keys
    else
      {
        build_date: 'na',
        build_cset: 'na',
        build_revision: 'na',
      }
    end
  end

  def self.render_build_info
    info = self.build_info
    "#{info[:build_tag]} - #{info[:build_date]} - #{info[:build_revision]} (#{info[:build_cset]})"
  end
end
