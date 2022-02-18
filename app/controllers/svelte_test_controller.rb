# frozen_string_literal: true

class SvelteTestController < ::WebController

  protect_from_forgery with: :reset_session

  def hello
  end

  def post_select
    render :select
  end
end
