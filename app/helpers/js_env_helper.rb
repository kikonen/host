#
# Pass environment info from rails to js side
#
# @see http://codetunes.com/2014/5-tips-on-how-to-use-angularjs-with-rails-that-changed-how-we-work/
#
# USAGE:
# class FooController
#   include JsEnvHelper
#   ...
#   helper JsEnvHelper
# end
module JsEnvHelper
  def js_env
    @js_env ||= {
      env: Rails.env,
      development: Rails.env.development?,
      production: Rails.env.production?,
      debug: Settings.ui.debug
    }
  end

  def include_js_env
    "<script>window.Rails = #{js_env.to_json};</script>".html_safe
  end
end
