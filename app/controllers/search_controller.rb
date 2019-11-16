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
    fetch_offset = params[:fetch_offset] || 0

    entries = fetch_entries
    query = fetch_query.upcase.strip
    fetched = entries.filter do |item|
      item[:up_text] ||= item[:text].upcase
      item[:up_desc] ||= item[:desc].upcase
      query.empty? || item[:up_text].include?(query) || item[:up_desc].include?(query)
    end

    data = {
      entries: fetched,
      more: false,
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
    entries
  end

  def verify_authenticity_token
    super
  end
end
