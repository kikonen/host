class GiAlbum::ThumbController < ::ApiController
  def show
    size = Integer(params[:size] || GiAlbum::Photo::DEF_THUMB_SIZE)
    elem = album.root.create_element(params[:path])
    thumb = elem.read_thumb(size)

    response.headers["Expires"] = CGI.rfc1123_date(Time.now + 365.days)
    send_file(
      thumb[:full_path],
      type: thumb[:content_type],
      disposition: 'inline')
  end

  def album
    @album ||= GiAlbum::Album.new
  end
end
