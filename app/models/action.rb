class Action < ActiveRecord::Base
  # attr_accessible :title, :body
  belongs_to :verb
  belongs_to :item
end
