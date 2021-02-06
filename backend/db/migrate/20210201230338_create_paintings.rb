class CreatePaintings < ActiveRecord::Migration[6.1]
  def change
    create_table :paintings do |t|
      t.string :name 
      t.integer :user_id
      t.text :color_data
      t.timestamps
    end
  end
end
