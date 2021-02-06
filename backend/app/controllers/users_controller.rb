class UsersController < ApplicationController
    def index
        users = User.all 
        render json: users
    end 

    def show 

    end 

    def create
        users = User.all 
        User.create(:username => params[:username])
        render json: users
    end 
end
