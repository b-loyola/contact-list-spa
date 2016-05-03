$(function() {

	$('#get-all-contacts').on('click', function(){
		$.getJSON('/contacts', function(contacts){
			$.each(contacts, function(){
				contact = $(this);
				// debugger;
				$('<tr>')
					.append($('<td>').text(contact[0].first_name))
					.append($('<td>').text(contact[0].last_name))
					.append($('<td>').text(contact[0].email))
					.appendTo($('#contact-list'));

			});
			// $('#contact-name').text(contact.first_name + " " + contact.last_name);
			// $('#contact-email').text(contact.email);
		});
	});

});
