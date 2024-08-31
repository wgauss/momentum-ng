class ScheduleItemsController < ApplicationController
  def index
    @schedule_items = ScheduleItem.all
    render json: @schedule_items
  end

  def show
    @schedule_item = ScheduleItem.find(params[:id])
    render json: @schedule_item
  end

  def create
    @schedule_item = ScheduleItem.new(schedule_item_params)
    if @schedule_item.save
      render json: @schedule_item, status: :created
    else
      render json: @schedule_item.errors, status: :unprocessable_entity
    end
  end

  def update
    @schedule_item = ScheduleItem.find(params[:id])
    if @schedule_item.update(schedule_item_params)
      render json: @schedule_item
    else
      render json: @schedule_item.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @schedule_item = ScheduleItem.find(params[:id])
    @schedule_item.destroy
    head :no_content
  end

  private

  def schedule_item_params
    params.require(:schedule_item).permit(:title, :description)
  end
end

