class SvelteTestController < ::WebController

  def hello
  end

  def post_select
    render :select
  end
end
