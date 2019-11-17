class GiAlbum::PhotoDir < GiAlbum::Element
  HIDDEN_DIRS = [
    /backup/,
    /lib/,
    /misc/,
    /private/,
    /thumb/,
    /trash/,
    /work/,
  ]

  def self.thumb
    @thumb ||= {
      full_path: "#{GiAlbum.gem_root_dir}/app/assets/images/gi_album/material/folder.svg",
      content_type: 'image/svg',
    }
  end

  def dir?
    true
  end

  def valid?
    @valid ||=
      begin
        p = path.downcase
        super && HIDDEN_DIRS.none? { |pattern| p =~ pattern }
      end
  end

  def list
    return [] unless valid?

    logger.debug "FULL_PATH: #{full_path}"

    unless File.exists?(full_path)
      raise "Path missing: #{full_path}"
    end

    glob = "#{full_path}/*"
    elements = Dir[glob]
                 .map do |f|
      elem_path = f[@root_dir.length + 1, f.length]
      create_element(elem_path)
    end.compact

    dirs = elements
             .select { |e| e.dir? }
             .sort { |a,b| a.name <=> b.name }

    photos = elements
               .select { |e| e.photo? || e.video? }
               .sort { |a,b| a.name <=> b.name }
    #      GiAlbum::Photo.fill_image_info(photos)

    dirs + photos
  end

  #
  # @return Created element, nil if not valid element
  #
  def create_element(elem_path)
    cls = GiAlbum::Element.get(full_element_path(elem_path))
    elem = cls ? cls.new(album, elem_path) : nil
    elem && elem.valid? ? elem : nil
  end

  def create_photo(elem_path)
    GiAlbum::Photo.new(album, elem_path)
  end

  def read_thumb(size)
    self.class.thumg
  end

  private

  def full_element_path(elem_path)
    "#{@root_dir}/#{elem_path}"
  end
end
