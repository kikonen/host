class SearchController < ::RestController
  def search_xhr
    fetch_query = params[:fetch_query] || ''
    fetch_offset = params[:fetch_offset] || 0

    entries = [
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
        text: 'bar really long entry here to check how sizing works EOF',
        desc: 'hippo',
      },
    ]

    query = fetch_query.upcase.strip
    fetched = entries.filter do |item|
      query.empty? || item[:text].upcase.include?(query)
    end

    data = {
      entries: fetched,
      more: false,
    }

    render json: data
  end

  def verify_authenticity_token
    super
  end
end
