class CreateVerbs < ActiveRecord::Migration
  def change
    create_table :verbs do |t|
      t.string :verb
      t.timestamps
    end
  end
end
