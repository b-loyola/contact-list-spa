$(function() {

	function clearTable(){
		$('#contact-list tbody').empty();
	}

	function addContactsToTable(contacts){
		var nodes = contacts.map(function(contact){
			return $('<tr>')
				.addClass('table-data')
				.append($('<td>').text(contact.first_name))
				.append($('<td>').text(contact.last_name))
				.append($('<td>').text(contact.email));
		});
		$('#contact-list tbody').append(nodes);
	}

	$('#get-all-contacts').on('click', function(){
		clearTable();
		$.getJSON('/contacts', addContactsToTable);
	});

	$('#search-contacts').on('click', function(){
		clearTable();
		var query = $('#search-term').val();
		$.getJSON('/contacts', {query: query}, addContactsToTable);
	});

});
