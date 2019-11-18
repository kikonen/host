#Babel.options do |opt|
#  opt[:modules] = 'system'
#end

module Sprockets
  class BabelProcessor
    def self.instance
      @instance ||= new(
        'modules' =>  'system',
        'moduleIds' => 'true',
      )
    end
  end
end
