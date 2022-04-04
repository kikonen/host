# frozen_string_literal: true

module IconHelper
  def ki_icon(icon, size = :normal)
    icon_url = "#{icon}"
    sz = Icon::SIZES[size]
    image_tag(icon_url, width: sz, height: sz)
  end
end
