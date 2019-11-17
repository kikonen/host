class GiAlbum::Video < GiAlbum::Element
  VALID_TYPES = [
    '.avi',
    '.mp4',
    '.mov',
  ]

  MIME_TYPES = {
  }

  attr_accessor :video_info


  def initialize(album, path)
    super
    @video_info = {
      format: 'NA',
      size: '0x0',
    }
  end

  def video?
    true
  end

  def valid?
    @valid ||=
      begin
        p = file_ext.downcase
        super && VALID_TYPES.any? { |ext| ext = p }
      end
  end

  def image
    @image ||= Magick::Image.read(full_path).first
  end

  #
  # @return full path to thumb
  #
  def read_thumb(size)
    {
      full_path: "#{GiAlbum.gem_root_dir}/app/assets/images/gi_album/material/folder.svg",
      content_type: 'image/svg',
    }
  end
end
