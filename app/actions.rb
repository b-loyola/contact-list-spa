get '/' do
  erb :index
end

get '/contacts/?' do
	if params[:query]
		Contact.search(params[:query]).to_json
	else
		Contact.all.to_json
	end
end

post '/contacts/?' do
	if params[:first_name] && params[:last_name] && params[:email]
		Contact.create(first_name: params[:first_name], last_name: params[:last_name], email: params[:email])
	else
		status 400
	end
end