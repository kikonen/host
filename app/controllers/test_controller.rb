class TestController < BaseController
  respond_to :html, :js

  def show
    @ng_app = 'test'
  end

  def pollute
    @pollute = "POLLUTE!!"
  end
end
