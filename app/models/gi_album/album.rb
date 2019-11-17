class GiAlbum::Album
  attr_reader :root_dir

  def initialize
    @root_dir = GiAlbumSupport.config.album.root_dir
    unless File.exists?(work_dir)
      FileUtils.mkdir_p(work_dir)
    end
  end

  def root
    @root ||= GiAlbum::PhotoDir.new(self, '')
  end

  def list(photo_dir_path)
    dir = GiAlbum::PhotoDir.new(self, photo_dir_path)
    dir.list
  end

  def logger
    Rails.logger
  end

  def work_dir
    @work_dir ||= "#{Rails.root}/shared/gi_album"
  end
end
