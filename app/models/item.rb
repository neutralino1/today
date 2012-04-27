class Item < ActiveRecord::Base
  # attr_accessible :title, :body
  has_many :actions
end
