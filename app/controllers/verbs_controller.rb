class VerbsController < ApplicationController

  def complete
    verb = Verb.where("verb REGEXP '^#{params[:q]}'").order('verb ASC').first
    render :text => verb ? verb.verb : ''
  end
end
