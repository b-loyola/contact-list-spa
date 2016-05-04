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
	contact = Contact.new(first_name: params[:first_name], last_name: params[:last_name], email: params[:email])
	if contact.save
		contact.to_json
	else
		status 400
	end
end

delete '/contacts/:id/?' do
	contact = Contact.find(params[:id])
	if contact.destroy
		contact.to_json
	else
		status 400
	end
end

post '/contacts/:id/?' do
	contact = Contact.find(params[:id])
	contact.assign_attributes(first_name: params[:first_name], last_name: params[:last_name], email: params[:email])
	if contact.save
		contact.to_json
	else
		status 400
	end
end