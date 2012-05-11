require 'net/http'
require 'json'
require 'open-uri'

module Trakt

  DEFAULT_LIMIT = 10

  class Client
    attr_accessor :api_key
    
    def search(media, query, limit)
      return nil unless [:movies, :shows].include?(media)
      uri = URI("http://api.trakt.tv/search/#{media.to_s}.json/#{@api_key}/#{query.sub(' ', '+')}")
      res = Net::HTTP.get_response(uri)
      res = JSON.parse(res.body)
      n = limit ? limit : DEFAULT_LIMIT
      results = []
      res[0..n].each do |r|
        results << Item.new(:name => r['title'], :url => r['url'],
                           :picture => r['images']['poster'].split('.jpg')[0]+'-138.jpg',
                           :what => media == :movies ? 'movie' : 'tv-show') unless r['images']['poster'] == 'http://vicmackey.trakt.tv/images/poster-small.jpg'
      end
      results
    end

  end

  def connect(key)
    c = Client.new
    c.api_key = key
    c
  end
end
