class GiPaint::UiController < GiPaint::EngineController
  layout 'gi_paint/engine'

  def show
    #      @show_navbar = false
    @show_breadcrumb = false
    @base_href = "/gi_paint/"
    @ng_app = "paint"
  end
end
