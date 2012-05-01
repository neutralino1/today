require 'net/http'
require 'json'
require 'open-uri'
require 'nokogiri'

class ItemsController < ApplicationController

  def query
    verb = params[:verb]
    case verb
    when 'watched'
      uri = URI('http://api.rottentomatoes.com/api/public/v1.0/movies.json')
      pars = {:apikey => 'rb2x856cbuak57fu5e7n48mh', :q => params[:q], :page_limit => 5}
      uri.query = URI.encode_www_form(pars)
      res = Net::HTTP.get_response(uri)
      res = JSON.parse(res.body)
#      raise res[:movies].inspect
      @movies = res['movies']
      uri = URI('http://www.tv.com/search')
      pars = {:q => params[:q]}
      uri.query = URI.encode_www_form(pars)
      res = Nokogiri::HTML(open(uri))
      @tvshows = []
      res.css('div.show_result')[0..4].each do |r|
        @tvshows << {:url => "http://www.tv.com" + r.css('a').first.attributes['href'].value,
          :picture => r.css('img').first.attributes['src'].value.sub('sm', 'pL'),
          :name => r.css('img').first.attributes['alt'].value}
      end
      render :partial => 'suggestions'
    when 'listened to'
      uri = URI('http://ws.audioscrobbler.com/2.0/')
      pars = {:api_key => 'cc29f9738ebdf3a626c29500a0f3f88b', :method => 'artist.search', :artist => params[:q],
        :limit => 5}
      uri.query = URI.encode_www_form(pars)
      res = Nokogiri::HTML(open(uri))
      @artists = []
      res.xpath('//artist').each do |r|
        @artists<<{:url => r.css('url').first.children.first.content,
        :picture => r.xpath("image[@size='extralarge']").children.first.content}
      end
      render :partial => 'music_suggestions'
    else
    end
  end

end
