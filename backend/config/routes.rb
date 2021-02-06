Rails.application.routes.draw do
  root "users#index"
  resources :users, only: [:show, :new, :create]
  resources :paintings, only: [:index, :update, :create]
  
 
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
