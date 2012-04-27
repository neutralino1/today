class VerbsController < ApplicationController

  def complete
    @verbs = params[:q].empty? ? [] : Verb.where("verb REGEXP '^#{params[:q]}'").order('verb ASC')
    render :partial => 'complete'
  end
end
