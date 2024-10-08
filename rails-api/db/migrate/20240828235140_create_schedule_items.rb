class CreateScheduleItems < ActiveRecord::Migration[7.2]
  def change
    create_table :schedule_items do |t|
      t.datetime :date
      t.string :weekday
      t.string :color
      t.string :title
      t.text :description

	  create_table :goals do |t|
		t.string :title
		t.text :mainObjective
		t.date :targetDate
  
      t.timestamps
    end
  end
end

