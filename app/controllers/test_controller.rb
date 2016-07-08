class TestController < BaseController
  def show
    @ng_app = 'test'
  end

  def pollute
    @pollute = "POLLUTE!!"
  end
end
