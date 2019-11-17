class SearchController < ::RestController
  SAMPLE = [
    {
      text: 'rest',
      desc: 'hippo',
    },
    {
      text: 'foo',
      desc: 'hippo',
    },
    {
      text: 'zoo',
      desc: 'hippo',
    },
    {
      text: 'boo',
      desc: 'hippo',
    },
    {
      text: 'aoo',
      desc: 'hippo',
    },
    {
      text: 'boo',
      desc: 'hippo',
    },
    {
      text: 'coo',
      desc: 'hippo',
    },
    {
      text: 'doo',
      desc: 'hippo',
    },
    {
      text: 'eoo',
      desc: 'hippo',
    },
    {
      text: 'bar really long entry here to check how sizing works EOF',
      desc: 'hippo',
    },
  ]
  FAKE_LOCK = Mutex.new

  def search_xhr
    fetch_query = params[:fetch_query] || ''
    fetch_offset = Integer(params[:fetch_offset] || 0)
    fetch_limit = Integer(params[:fetch_limit] || 10)
    query = fetch_query.upcase.strip

    all_entries = fetch_entries
    total_size = all_entries.size

    filtered_entries = all_entries.filter do |item|
      query.empty? || item[:up_text].include?(query) || item[:up_desc].include?(query)
    end

    limited_entries = filtered_entries[fetch_offset, fetch_limit]

    data = {
      entries: limited_entries,
      more: fetch_offset + fetch_limit < total_size,
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
      r
    end

    entries
  end

  def verify_authenticity_token
    super
  end
end
