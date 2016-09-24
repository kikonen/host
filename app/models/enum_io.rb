class EnumIO < StringIO
  def initialize(out)
    super('')
    @out = out
  end

  def write(string)
    $stdout.puts "===="
    $stdout.puts string
    $stdout.puts "----"
    @out << string
  end
end
