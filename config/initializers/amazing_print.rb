module AmazingPrint
  class Inspector
    def load_dotfile
      dotfile = File.join(ENV['HOME'], '.amazingprintrc')
      load dotfile if dotfile_readable?(dotfile)
    end
  end
end
