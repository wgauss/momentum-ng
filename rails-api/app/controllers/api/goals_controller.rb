# app/controllers/api/goals_controller.rb
module Api
	class GoalsController < ApplicationController
	  before_action :load_goals, only: [:index, :create, :update, :destroy]
	  before_action :find_goal, only: [:show, :update, :destroy]
  
	  def index
		render json: @goals
	  end
  
	  def show
		if @goal
		  render json: @goal
		else
		  render json: { error: 'Goal not found' }, status: :not_found
		end
	  end
  
	  def create
		new_goal = goal_params.merge("id" => SecureRandom.uuid)
		@goals << new_goal
		save_goals
  
		render json: new_goal, status: :created
	  end
  
	  def update
		if @goal
		  @goal.merge!(goal_params)
		  save_goals
		  render json: @goal
		else
		  render json: { error: 'Goal not found' }, status: :not_found
		end
	  end
  
	  def destroy
		if @goal
		  @goals.delete_if { |goal| goal["id"] == params[:id] }
		  save_goals
		  head :no_content
		else
		  render json: { error: 'Goal not found' }, status: :not_found
		end
	  end
  
	  private
  
	  def load_goals
		file_path = Rails.root.join('db', 'goals.json')
		if File.exist?(file_path)
		  begin
			file_content = File.read(file_path)
			@goals = JSON.parse(file_content) if file_content.present?
		  rescue JSON::ParserError => e
			Rails.logger.error { "JSON parse error: #{e.message}" }
			@goals = []
		  end
		else
		  @goals = []
		end
		Rails.logger.debug { "Loaded goals: #{@goals.inspect}" }
	  end
  
	  def save_goals
		file_path = Rails.root.join('db', 'goals.json')
		File.open(file_path, 'w') do |file|
		  # Ensure @goals is an array of hashes
		  if @goals.is_a?(Array) && @goals.all? { |goal| goal.is_a?(Hash) }
			file.write(JSON.pretty_generate(@goals))
		  else
			Rails.logger.error { "Data to save is not a proper array of hashes: #{@goals.inspect}" }
		  end
		end
		Rails.logger.debug { "Saved goals: #{@goals.inspect}" }
	  end
  
	  def find_goal
		@goal = @goals.find { |goal| goal["id"] == params[:id] }
		Rails.logger.debug { "Found goal: #{@goal.inspect}" }
	  end
  
	  def goal_params
		# Permit top-level attributes and nested attributes
		params.permit(:title, :mainObjective, :targetDate,
					  subGoals: [:title, :currentValue, :targetValue, :unit])
			.to_h
	  end
	end
  end