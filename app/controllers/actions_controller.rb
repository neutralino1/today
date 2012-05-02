class ActionsController < ApplicationController
  def create
    item=Item.where(:what => params[:what], :url => params[:url]).first
    item = Item.create(:what => params[:what], :url => params[:url], :picture => params[:picture]) unless item
    verb = Verb.where(:verb => params[:verb]).first
    Action.create(:item => item, :verb => verb)
    render :text => 'ok'
  end

  def poster
    # @actions = Action.order('created_at DESC').all
    @actions = Action.order('RAND()').all
    render :partial => 'poster'
  end

  def timeline
    @actions = Action.order('created_at DESC').all
    render :partial => 'timeline'
  end
end
