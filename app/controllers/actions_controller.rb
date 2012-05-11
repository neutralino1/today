class ActionsController < ApplicationController
  def create
    item=Item.where(:what => params[:what], :url => params[:url], :name => params[:name]).first
    item = Item.create(:what => params[:what], :url => params[:url], :picture => params[:picture], :name => params[:name]) unless item
    verb = Verb.where(:verb => params[:verb]).first
    Action.create(:item => item, :verb => verb)
    render :json => item.to_json
  end

  def poster
    # @actions = Action.order('created_at DESC').all
    @actions = Action.order('RAND()').all
    render :partial => 'poster'
  end

  def pictures
    @pictures = Action.order('created_at DESC').all.map do |action| 
      {:picture => action.item.picture, :name => action.item.name}
    end
    render :json => @pictures.to_json
  end

  def timeline
    @actions = Action.order('created_at DESC').all
    render :partial => 'timeline'
  end
end
