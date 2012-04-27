class CreateActions < ActiveRecord::Migration
  def change
    create_table :actions do |t|
      t.integer :verb_id
      t.integer :item_id
      t.timestamps
    end
  end
end
