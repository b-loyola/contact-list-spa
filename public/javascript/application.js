$(function() {

	function clearTable(){
		$('#contact-list').find('tbody').empty();
	}

	function addContactsToTable(contacts){
		var nodes = contacts.map(function(contact){
			return $('<tr>')
				.addClass('table-data')
				.append($('<td>').text(contact.first_name))
				.append($('<td>').text(contact.last_name))
				.append($('<td>').text(contact.email));
		});
		$('#contact-list').find('tbody').append(nodes);
	}

	$('#get-all-contacts').on('click', function(){
		clearTable();
		$.getJSON('/contacts', addContactsToTable);
	});

	$('#search-contacts').on('click', function(){
		clearTable();
		var query = $('#search-term').val();
		$.getJSON('/contacts', {query: query}, addContactsToTable);
		return false;
	});

	$('#add-contact').on('click', function(){
		var first_name = $('#contact-first-name').val();
		var last_name = $('#contact-last-name').val();
		var email = $('#contact-email').val();
		$.post('/contacts', {first_name: first_name, last_name: last_name, email: email}, function(){
			// TODO: after successfully adding contact
		});
	});

});
