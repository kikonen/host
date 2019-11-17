# TODO KI rmagic not working with imagemagick 7
#require 'rmagick'

class GiAlbum::Photo < GiAlbum::Element
  DEF_THUMB_SIZE = 64

  VALID_TYPES = [
    '.gif',
    '.jpg',
    '.jpeg',
    '.png',
  ]

  MIME_TYPES = {
    'jpg' => 'image/jpeg',
  }

  attr_accessor :image_info


  def initialize(album, path)
    super
    @image_info = {
      format: 'NA',
      size: '0x0',
    }
  end

  def photo?
    true
  end

  def valid?
    @valid ||=
      begin
        p = file_ext.downcase
        super && VALID_TYPES.any? { |ext| ext == p }
      end
  end

  def mime_type
    @mime_type =
      begin
        type = MIME_TYPES[plain_ext]
        type = "image/#{plain_ext}" unless type
        type
      end
  end

  def thumb_path(size)
    @thumb_path ||= {}
    @thumb_path[size] ||= "thumbnail/#{base_path}-thumb-#{size}#{file_ext}"
  end

  def full_thumb_path(size)
    @full_thumb_path ||= {}
    @full_thumb_path[size] ||= "#{album.work_dir}/#{thumb_path(size)}"
  end

  def image
    @image ||= Magick::Image.read(full_path).first
  end

  #
  # @return full path to thumb
  #
  def read_thumb(size)
    create_thumb(size)
    {
      full_path: full_thumb_path(size),
      content_type: mime_type
    }
  end

  def create_thumb(size)
    target_path = full_thumb_path(size)
    return if File.exists?(target_path)

    logger.info "creating thumb: #{full_path} => #{target_path}"

    # TODO KI instead of resize, should use existing thumb data from file (EXIF)
    # if such exists
    #      thumb = image.resize_to_fit(size, size)
    #      thumb.write(target_path)

    FileUtils.mkdir_p(File.dirname(target_path))
    cmd = %(convert -thumbnail #{size}x#{size} "#{full_path.gsub(/"/, '\"')}" "#{target_path.gsub(/"/, '\"')}")
    logger.info cmd

    %x(#{cmd})
    # fork do
    #   exec cmd
    # end
    # Process.wait

    logger.info "created thumb: #{target_path}"
  end


  #
  # Fetch and fill image info for photos as batch operation
  #
  # PARSED FORMAT:
  # identify /mnt/share/Photos/album/kari.jpg /mnt/share/Photos/album/kari_1.jpg /mnt/share/Photos/album/kari_5.jpg
  # /mnt/share/Photos/album/kari.jpg JPEG 476x499 476x499+0+0 8-bit sRGB 42.8KB 0.000u 0:00.000
  # /mnt/share/Photos/album/kari_1.jpg[1] JPEG 488x485 488x485+0+0 8-bit sRGB 20KB 0.000u 0:00.000
  #/mnt/share/Photos/album/kari_5.jpg[2] JPEG 500x477 500x477+0+0 8-bit sRGB 165KB 0.010u 0:00.009

  def self.fill_image_info(all_photos)
    all_photos.each_slice(50) do |photos|
      by_path = photos.index_by(&:full_path)
      paths = photos.map do |e|
        e.full_path.gsub(/"/, '\"')
      end

      query_paths = '"' + paths.join('" "') + '"'
      cmd = "identify #{query_paths}"
      logger.info cmd
      result = %x(#{cmd})

      result.each_line do |line|
        data = line.split(' ')
        path = data[0].split('[').first
        puts path => data
        photo = by_path[path]
        if photo
          photo.image_info = {
            format: data[1],
            size: data[2]
          }
        else
          ::Rails.logger.info "Not found: #{line}"
        end
      end
    end
    all_photos
  rescue => e
    # If parsing fails; just ignore problem for now
    logger.error e
  end
end
