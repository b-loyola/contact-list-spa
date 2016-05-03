class Contact < ActiveRecord::Base
	validates :first_name, presence: true
	validates :last_name, presence: true
	validates :email, presence: true

	def self.search(term)
		self.where("first_name LIKE :term OR last_name LIKE :term OR email LIKE :term", term: "%" + term + "%")
	end

end