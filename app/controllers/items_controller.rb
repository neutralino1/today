require 'net/http'
require 'json'
require 'open-uri'
require 'nokogiri'
require 'imdb'

include Trakt

class ItemsController < ApplicationController

  def query
    verb = params[:verb]
    case verb
    when 'watched'
      @result_type = 'Movies & TV shows'
      client = Trakt.connect('a0c144cdc8998145b83453b835d5950c')
      @results = client.search(:movies, params[:q], 5) # imdb.movies[0..4].map { |m| Item.new_from(m) }
      @results += client.search(:shows, params[:q], 5)
=begin
      uri = URI('http://api.rottentomatoes.com/api/public/v1.0/movies.json')
      pars = {:apikey => 'rb2x856cbuak57fu5e7n48mh', :q => params[:q], :page_limit => 5}
      uri.query = URI.encode_www_form(pars)
      res = Net::HTTP.get_response(uri)
      res = JSON.parse(res.body)
      @movies = res['movies']
      uri = URI('http://www.tv.com/search')
      pars = {:q => params[:q]}
      uri.query = URI.encode_www_form(pars)
      res = Nokogiri::HTML(open(uri))
      @tvshows = []
      res.css('li.result.show')[0..4].each do |r|
        @tvshows << {:url => "http://www.tv.com" + r.css('a').first.attributes['href'].value,
          :picture => r.css('img').first.attributes['src'].value.sub('sm', 'pL'),
          :name => r.css('img').first.attributes['alt'].value}
      end
=end
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
    when 'read'
      uri = URI('https://www.googleapis.com/books/v1/volumes')
      pars = {:key => 'AIzaSyDWJ0TicIIi28J6R6PXYqBMlt0XTbwyURQ', :q => params[:q], :maxResults => 5}
      uri.query = URI.encode_www_form(pars)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.start do |h|
        res = h.request(Net::HTTP::Get.new(uri.request_uri))
      end
#      res = http.get_response(uri)
      res = JSON.parse(res.body)
      @books = []
      res['items'].each do |i|
        @books << {:url => i['volumeInfo']['infoLink'],
          :name => "#{i['volumeInfo']['title']} by #{i['volumeInfo']['authors'].first}",
          :picture => i['volumeInfo']['imageLinks']['thumbnail']}
      end
      render :partial => 'read_suggestions'
    else
    end
  end

end
