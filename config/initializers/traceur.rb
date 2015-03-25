Traceur.configure do |c|
  precompiled = ENV['ASSETS'] == 'true' || !(Rails.env.development? || Rails.env.test?)
  c.default_compilation_options.modules = :register
  c.default_compilation_options.source_map = !precompiled
end
