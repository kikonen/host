module BuildInfo
  BUILD_INFO_FILE = File.join(Rails.root, "docker", "build_info.json")

  def self.build_info
    @build_info ||= begin
      { container_version: ENV['CONTAINER_VERSION']}.merge!(read_build_info)
    end
  end

  def self.read_build_info
    if File.exist?(BUILD_INFO_FILE)
      data = File.read(BUILD_INFO_FILE)
      JSON.parse(data).symbolize_keys
    else
      {
        build_date: 'na',
        build_cset: 'na',
        build_tag: 'na',
        build_branch: 'na',
      }
    end
  end

  def self.render_build_info
    info = self.build_info
    parts = [
      info[:container_version],
      info[:build_date],
      info[:build_tag],
    ]
    unless info[:build_tag]
      parts << info[:build_branch]
      parts << info[:build_cset]
    end

    parts.compact.join(" - ")
  end
end
