Rails.application.routes.draw do
  namespace :api do
    resources :schedule_items, only: [:index, :create, :update, :destroy]
	resources :goals, only: [:index, :show, :create, :update, :destroy]
	end
end

