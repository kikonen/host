module GiAlbumSupport
  def self.config
    @config ||= Config.load_files(Config.setting_files("#{Rails.root}/config/gi_album", Rails.env))
  end
end
