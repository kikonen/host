class GiAlbum::Element
  attr_reader :album, :root_dir, :path

  def self.types
    @@types ||= {}
  end

  def self.register(cls, file_exts)
    file_exts.each { |ext| types[ext] = cls }
  end

  def self.register_all
    [GiAlbum::Photo, GiAlbum::Video].each do |cls|
      register cls, cls::VALID_TYPES
    end
  end

  #
  # @return implementation to represent full_path, nil if not found
  #
  def self.get(full_path)
    if File.directory? full_path
      GiAlbum::PhotoDir
    else
      register_all if types.empty?
      types[File.extname(full_path).downcase]
    end
  end

  def initialize(album, path)
    @album = album
    @root_dir = @album.root_dir
    @path = path || ''
  end

  def valid?
    # NOTE KI reduce changes of accessing files outside of album
    full_path.start_with?(@root_dir)
  end

  def photo?
    false
  end

  def video?
    false
  end

  def dir?
    false
  end

  def name
    @name ||= File.basename(@path)
  end

  def full_path
    @full_path ||= File.absolute_path(@path.empty? ? "#{@root_dir}" : "#{@root_dir}/#{@path}")
  end

  def base_path
    @base_path ||= @path[0..-(file_ext.length + 1)]
  end

  def plain_ext
    @plain_ext ||= file_ext[1, file_ext.length].downcase
  end

  def file_ext
    @file_ext ||= File.extname(@path)
  end

  def logger
    Rails.logger
  end
end
