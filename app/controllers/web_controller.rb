# frozen_string_literal: true

class WebController < ApplicationController
  include JsEnvHelper

  helper JsEnvHelper
  helper NgTemplate::TemplateHelper

  before_action :require_basic_setup

  before_action :require_ng_strict_di


  def require_basic_setup
    @show_navbar = true
    @show_breadcrumb = true
  end

  #
  # Enforce strict dependency check if precompiled assets
  #
  def require_ng_strict_di
    @ng_strict_di = ENV['NG_FORCE'] == 'true' || !Rails.application.config.assets.compile
  end
end
