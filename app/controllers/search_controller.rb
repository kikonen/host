class SearchController < ::RestController
  FAKE_LOCK = Mutex.new

  def search_xhr
    fetch_query = params[:fetch_query] || ''
    fetch_id = (params[:fetch_id] || '').to_i
    fetch_offset = Integer(params[:fetch_offset] || 0)
    fetch_limit = Integer(params[:fetch_limit] || 10)
    query = fetch_query.upcase.strip

#    ap params.permit!
#    sleep 2

    if fetch_id > 0
      matcher = ->(item) {
        item[:id] == fetch_id
      }
    else
      matcher = ->(item) {
        query.empty? || item[:up_text].include?(query) || item[:up_desc].include?(query)
      }
    end

    all_entries = fetch_entries
    total_size = all_entries.size

    filtered_entries = all_entries.filter do |item|
      matcher.call(item)
    end

    limited_entries = filtered_entries[fetch_offset, fetch_limit] || []

    result_items = limited_entries.map do |item|
      {
        id: item[:id],
        text: item[:text],
        desc: item[:desc],
        data: {
          foo: item[:text],
        }
      }
    end

    data = {
      items: result_items,
      info: {
        more: fetch_offset + fetch_limit < filtered_entries.length,
        total_size: filtered_entries.length,
        result_size: limited_entries.length,
        fetch_query: fetch_query,
        fetch_offset: fetch_offset,
        fetch_limit: fetch_limit,
      }
    }

    render json: data
  end

  def fetch_entries
    self.class.fake_entries
  end

  def self.fake_entries
    FAKE_LOCK.synchronize {
      @fake_entries ||= create_fake_entries
    }
  end

  def self.create_fake_entries
    entries = []
    10000.times do |idx|
      name = Faker::Name.name
      entries << {
        id: idx + 1,
        text: name,
        desc: Faker::Internet.email(name: name),
      }
    end

    entries.each do |item|
      item[:up_text] ||= item[:text].upcase
      item[:up_desc] ||= item[:desc].upcase
    end

    entries.sort! do |a, b|
      r = a[:up_text] <=> b[:up_text]
      r = a[:text] <=> b[:text] if r == 0
      r = a[:up_desc] <=> b[:up_desc] if r == 0
      r = a[:desc] <=> b[:desc] if r == 0
      r = a[:id] <=> b[:id] if r == 0
      r
    end

    entries
  end

  def verify_authenticity_token
    super
  end
end
