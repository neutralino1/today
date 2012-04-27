class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.string :url
      t.string :picture
      t.string :what
      t.timestamps
    end
  end
end
