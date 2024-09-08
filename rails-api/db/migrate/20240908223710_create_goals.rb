class CreateGoals < ActiveRecord::Migration[7.2]
  def change
    create_table :goals do |t|
      t.string :title
      t.text :mainObjective
      t.date :targetDate

      t.timestamps
    end
  end
end
