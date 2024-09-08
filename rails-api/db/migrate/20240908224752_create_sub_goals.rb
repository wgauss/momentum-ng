class CreateSubGoals < ActiveRecord::Migration[7.2]
  def change
    create_table :sub_goals do |t|
      t.string :title
      t.float :current_value
      t.float :target_value
      t.string :unit
      t.references :goal, null: false, foreign_key: true

      t.timestamps
    end
  end
end
