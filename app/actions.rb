get '/' do
  erb :index
end

get '/contacts' do
	Contact.all.limit(5).to_json
end