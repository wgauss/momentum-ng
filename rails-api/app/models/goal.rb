# app/models/goal.rb
class Goal < ApplicationRecord
	has_many :sub_goals, dependent: :destroy
	accepts_nested_attributes_for :sub_goals, allow_destroy: true
  
	validates :title, :mainObjective, :targetDate, presence: true
  end
  