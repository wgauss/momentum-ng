# app/controllers/api/schedule_items_controller.rb
class Api::ScheduleItemsController < ApplicationController
  before_action :load_schedule_items, only: [:index, :create, :update, :destroy]
  before_action :find_schedule_item, only: [:show, :update, :destroy]

  def index
    render json: @schedule_items
  end

  def show
    if @schedule_item
      render json: @schedule_item
    else
      render json: { error: 'Item not found' }, status: :not_found
    end
  end

  def create
    new_item = schedule_item_params.merge("id" => SecureRandom.uuid)
    @schedule_items << new_item
    save_schedule_items
    render json: new_item, status: :created
  end

  def update
    if @schedule_item
      @schedule_item.merge!(schedule_item_params)
      save_schedule_items
      render json: @schedule_item
    else
      render json: { error: 'Item not found' }, status: :not_found
    end
  end

  def destroy
    if @schedule_item
      @schedule_items.delete_if { |item| item["id"] == params[:id] }
      save_schedule_items
      head :no_content
    else
      render json: { error: 'Item not found' }, status: :not_found
    end
  end

  private

  def load_schedule_items
    file_path = Rails.root.join('db', 'schedule.json')
    if File.exist?(file_path)
      @schedule_items = JSON.parse(File.read(file_path))
    else
      @schedule_items = []
    end
    Rails.logger.debug { "Loaded schedule items: #{@schedule_items.inspect}" }
  end

  def save_schedule_items
    file_path = Rails.root.join('db', 'schedule.json')
    File.open(file_path, 'w') do |file|
      file.write(JSON.pretty_generate(@schedule_items))
    end
    Rails.logger.debug { "Saved schedule items: #{@schedule_items.inspect}" }
  end

  def find_schedule_item
    @schedule_item = @schedule_items.find { |item| item["id"] == params[:id] }
    Rails.logger.debug { "Found schedule item: #{@schedule_item.inspect}" }
  end

  def schedule_item_params
    params.require(:schedule_item).permit(:date, :weekday, :color, :title, :description)
  end
end
