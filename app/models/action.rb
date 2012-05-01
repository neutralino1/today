class Action < ActiveRecord::Base
  attr_accessible :item, :verb
  belongs_to :verb
  belongs_to :item
end
