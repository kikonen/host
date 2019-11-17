class GiAlbum::UiController < ::BaseController
  layout 'gi_album/engine'

  def show
    @ng_app = true
    @show_navbar = false
    @show_breadcrumb = false
    @base_href = '/gi_album/'
  end
end
