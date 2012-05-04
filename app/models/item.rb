class Item < ActiveRecord::Base
  attr_accessible :url, :what, :picture, :name
  has_many :actions

  def self.new_from(it)
    return new_from_imdb(it) if it.is_a?(Imdb::Movie)
  end

  def self.new_from_imdb(movie)
    new(:url => movie.url,
        :picture => movie.poster,
        :what => 'movie',
        :name => movie.title)
  end
end
