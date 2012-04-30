require 'net/http'
require 'json'

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
      @items = res['movies']
      render :partial => 'suggestions'
    else
    end
  end
end
