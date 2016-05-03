get '/' do
  erb :index
end

get '/contacts' do
	if params[:query]
		Contact.search(params[:query]).to_json
	else
		Contact.all.to_json
	end
end