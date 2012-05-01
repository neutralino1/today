class Item < ActiveRecord::Base
  attr_accessible :url, :what, :picture
  has_many :actions
end
