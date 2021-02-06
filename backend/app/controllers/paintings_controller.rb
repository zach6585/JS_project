require 'pry'
class PaintingsController < ApplicationController
    def index 
        paintings = Painting.all
        render json: paintings
    end 


    def update
        
    end 

    def create 
        painting = Painting.create(:name => params["paintingName"], :user_id => params["userID"], :color_data => params["colorData"])
        render json: painting
    end 
end
