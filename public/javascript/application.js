$(function() {

	var display = {

		clear: function(){
			$('#contact-form').hide();
			$('#contact-list').find('tbody').empty();
		},

		addContactsToTable: function(contacts){
			var list = $('#contact-list');
			var nodes = contacts.map(function(contact){
				return $('<tr>')
					.attr('data-contact-id', contact.id)
					.append($('<td>').addClass('first-name').text(contact.first_name))
					.append($('<td>').addClass('last-name').text(contact.last_name))
					.append($('<td>').addClass('email').text(contact.email))
					.append($('<td>').append($('<button>').addClass('delete-button').addClass('btn btn-default').text('Delete')))
					.append($('<td>').append($('<button>').addClass('edit-button').addClass('btn btn-default').text('Edit')));
			});
			list.find('tbody').append(nodes);
			list.show();
		},

		message: function(msg){
			$('#message').text(msg);
		},

		form: function(addOrEdit){
			$('#contact-list').hide();
			$('#contact-id').val('');
			$('#contact-form').trigger('reset').attr('data-purpose', addOrEdit).show();
		},

		updateForm: function(msg){
			$('#contact-form').trigger('reset');
			display.message('Contact ' + msg + ' successfully');
		},

		populateForm: function(contact){
			$("#contact-id").val(contact.id);
			$("#contact-first-name").val(contact.first_name);
			$("#contact-last-name").val(contact.last_name);
			$("#contact-email").val(contact.email);
		},

		invalidSubmit: function(){
			display.message("Invalid submission");
		}

	};

	var get = {

		search: function(){
			$.getJSON('/contacts', {query: $('#search-term').val()}, display.addContactsToTable);
		},

		formDetails: function(){
			return {
				id: $('#contact-id').val(),
				first_name: $('#contact-first-name').val(),
				last_name: $('#contact-last-name').val(),
				email: $('#contact-email').val()
			};
		},

		submit: function(msg){
			var contact = get.formDetails();
			$.post('/contacts/' + contact.id, contact, function(){
				display.updateForm(msg + "ed");
			}).fail(display.invalidSubmit);
		}

	};

	$('#search-contacts').on('submit', function(event){
		event.preventDefault();
		display.clear();
		get.search();
	});

	$('#show-contact-form').on('click', function(){
		display.form("add");
	});

	$('#add-contact').on('click', function(event){
		event.preventDefault();
		var purpose = $('#contact-form').attr('data-purpose');
		get.submit(purpose);
	});

	$('#contact-list').on('click', '.delete-button', function(){
		var contactRow = $(this).closest('tr');
		var id = contactRow.attr('data-contact-id');
		$.post('/contacts/'+id, {_method:"delete"}, function(){
			contactRow.remove();
			display.message('Contact deleted successfully');
		});
	});

	$('#contact-list').on('click', '.edit-button', function(){
		display.form('edit');
		var row = $(this).closest('tr');
		display.populateForm({
			id: row.attr('data-contact-id'), 
			first_name: row.find('.first-name').text(),
			last_name: row.find('.last-name').text(),
			email: row.find('.email').text()
		});
	});

});
