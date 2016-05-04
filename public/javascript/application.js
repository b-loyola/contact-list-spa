$(function() {

	function clearTable(){
		$('#contact-list').find('tbody').empty();
	}

	function addContactsToTable(contacts){
		var list = $('#contact-list');
		var nodes = contacts.map(function(contact){
			return $('<tr>')
				// .addClass('table-data')
				.attr('data-contact-id', contact.id)
				.append($('<td>').addClass('first-name').text(contact.first_name))
				.append($('<td>').addClass('last-name').text(contact.last_name))
				.append($('<td>').addClass('email').text(contact.email))
				.append($('<td>').append($('<button>').addClass('delete-button').text('Delete')))
				.append($('<td>').append($('<button>').addClass('edit-button').text('Edit')));
		});
		list.find('tbody').append(nodes);
		list.show();
	}

	$('#get-all-contacts').on('click', function(){
		$('#contact-form').hide();
		clearTable();
		$.getJSON('/contacts', addContactsToTable);
	});

	$('#search-contacts').on('click', function(){
		$('#contact-form').hide();
		clearTable();
		var query = $('#search-term').val();
		$.getJSON('/contacts', {query: query}, addContactsToTable);
	});

	$('#show-contact-form').on('click', function(){
		$('#contact-list').hide();
		$('#contact-form').trigger('reset').attr('data-edit-contact', 'false').show();
	});

	$('#add-contact').on('click', function(){
		var id = $('#contact-id').val();
		var firstName = $('#contact-first-name').val();
		var lastName = $('#contact-last-name').val();
		var email = $('#contact-email').val();
		if ($('#contact-form').attr('data-edit-contact') === 'true') {
			$.post('/contacts/' + id, {first_name: firstName, last_name: lastName, email: email}, function(){
				$('#contact-form').trigger('reset');
				$('#message').text('Contact updated successfully');
			});
		} else {
			$.post('/contacts', {first_name: firstName, last_name: lastName, email: email}, function(){
				$('#contact-form').trigger('reset');
				$('#message').text('Contact added successfully');
			});
		}
		return false;
	});

	$('#contact-list').on('click', '.delete-button', function(){
		var contactRow = $(this).closest('tr');
		var id = contactRow.attr('data-contact-id');
		$.post('/contacts/'+id, {_method:"delete"}, function(){
			contactRow.remove();
			$('#message').text('Contact deleted successfully');
		});
	});

	$('#contact-list').on('click', '.edit-button', function(){
		$('#contact-list').hide();
		var contactRow = $(this).closest('tr');
		var id = contactRow.attr('data-contact-id');
		var firstName = contactRow.find('.first-name').text();
		var lastName = contactRow.find('.last-name').text();
		var email = contactRow.find('.email').text();
		var form = $('#contact-form');
		form.find("#contact-id").val(id);
		form.find("#contact-first-name").val(firstName);
		form.find("#contact-last-name").val(lastName);
		form.find("#contact-email").val(email);
		form.attr('data-edit-contact', 'true').show();
	});

});
