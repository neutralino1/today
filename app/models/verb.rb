class Verb < ActiveRecord::Base
  attr_accessible :verb
  has_many :actions
end
