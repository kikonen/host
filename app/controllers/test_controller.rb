class TestController < ::WebController
#  include ActionController::Live

  def show
    @ng_app = 'test'
  end

  def pollute
    @pollute = "POLLUTE!!"
  end

  def stream_json
    headers['Content-Type'] = 'application/json'
    headers['X-Accel-Buffering'] = 'no' # Stop NGINX from buffering
    headers["Cache-Control"] = "no-cache" # Stop downstream caching
#    headers["Transfer-Encoding"] = "chunked" # Chunked response header
    headers.delete("Content-Length") # See one line above

    Oj.to_stream(response.stream, get_events, mode: :compat)
  ensure
    response.stream.close
  end

  def stream
    headers['Content-Type'] = 'text/plain'
    headers['X-Accel-Buffering'] = 'no' # Stop NGINX from buffering
    headers["Cache-Control"] = "no-cache" # Stop downstream caching
#    headers["Transfer-Encoding"] = "chunked" # Chunked response header
    headers.delete("Content-Length") # See one line above

    # Anything that responds to #each can be used for a response_body
#    self.response_body = Enumerator.new do |out|
#      out << "1\n"
#      out << "2\n"
#      out << "3\n"
#    end

    out = response.stream

    get_events.each do |event|
      out.write "!event: "
      out.write event.keys.join(',')
      out.write "\n"
      event.each do |key, value|
        out.write "!"
        out.write key
        out.write ":\n"
        out.write value
        out.write "\n"
        out.write "!eof\n"
      end
    end
  ensure
    response.stream.close
  end

  def get_events
    [
      {
        id: "gi.table.refresh 1",
        html: "<table class='table table-hover table-striped'><tbody><tr><td>1</td><td>2</td></tr><tr><td>1</td><td>2</td></tr></tbody></table>"
      },
      {
        id: "gi.table.refresh 3",
        html: "<table class='table table-hover table-striped'><tbody><tr><td>2</td><td>2</td></tr><tr class='text-danger'><td>2</td><td>2</td></tr></tbody></table>"
      },
    ]
  end
end
