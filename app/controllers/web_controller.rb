class WebController < ApplicationController
  include JsEnvHelper

  helper JsEnvHelper
  helper NgTemplate::TemplateHelper

  before_filter :require_ng_strict_di

  #
  # Enforce strict dependency check if precompiled assets
  #
  def require_ng_strict_di
    @ng_strict_di = !Rails.application.config.assets.compile
  end
end
