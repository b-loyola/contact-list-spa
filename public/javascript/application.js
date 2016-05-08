$(function() {

	var display = {

		loading: function(){
			$('#loading').show();
		},

		loaded: function(){
			$('#loading').hide();
		},

		clear: function(){
			$('#contact-form').hide();
			$('#contact-list').hide();
			$('#contact-list').find('tbody').empty();
		},

		addContactsToTable: function(contacts){
			var list = $('#contact-list');
			if (contacts.length > 0) {
				var nodes = contacts.map(function(contact){
					return $('<tr>')
						.attr('data-contact-id', contact.id)
						.append($('<td>').addClass('first-name').text(contact.first_name))
						.append($('<td>').addClass('last-name').text(contact.last_name))
						.append($('<td>').addClass('email').text(contact.email))
						.append($('<td>').append($('<button>').addClass('delete-button').addClass('btn btn-default btn-danger').text('Delete')))
						.append($('<td>').append($('<button>').addClass('edit-button').addClass('btn btn-default btn-primary').text('Edit')));
				});
				list.find('tbody').append(nodes);
				list.show();
			} else {
				display.message("No results match you search criteria.");
			}
			display.loaded();
		},

		message: function(msg){
			var $message = $('#message');
			$message.hide();
			$message.text(msg);
			$message.fadeIn(50);
			window.setTimeout(function(){
				$message.fadeOut(300, display.unhideMsgField);
			}, 3000);
		},

		unhideMsgField: function(){
			$('#message').text('').show().attr('class','');
		},

		form: function(addOrEdit){
			$('#contact-list').hide();
			$('#contact-id').val('');
			$('#form-heading').text(addOrEdit + " contact");
			$('#contact-form').trigger('reset').attr('data-purpose', addOrEdit).show();
		},

		updateForm: function(msg){
			var email = $('#contact-form').find('#contact-email').val();
			$('#contact-form').trigger('reset');
			display.message('Contact ' + msg + ' successfully');
			if (msg === 'Edited') {
				$('#contact-form').hide();
			}
		},

		populateForm: function(contact){
			$("#contact-id").val(contact.id);
			$("#contact-first-name").val(contact.first_name);
			$("#contact-last-name").val(contact.last_name);
			$("#contact-email").val(contact.email);
		},

		invalidSubmit: function(){
			$('#message').addClass('red-warning');
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

	var validate = {
		name: function($fields){
			var $name = $fields.filter('input');
			var $validations = $fields.filter('div.requirements');
			var $length = $validations.find('.length');
			var $letters = $validations.find('.letters');

			if ($name.val().length < 2) {
				$name.addClass('error');
				$length.removeClass('valid').addClass('invalid');
			} else {
				$name.removeClass('error');
				$length.removeClass('invalid').addClass('valid');
			}
			if (!$name.val().match(/^[A-Za-z]+$/)) {
				$name.addClass('error');
				$letters.removeClass('valid').addClass('invalid');
			} else {
				$name.removeClass('error');
				$letters.removeClass('invalid').addClass('valid');
			}
		},
		firstName: function(){
			var $firstNameFields = $('#contact-form').find('.first-name');
			validate.name($firstNameFields);
		},
		lastName: function(){
			var $lastNameFields = $('#contact-form').find('.last-name');
			validate.name($lastNameFields);
		},
		email: function(){
			var $email = $('#contact-email');
			if (!$email.val().match(/^.+@.+\..+$/)){
				$email.addClass('error');
				$('#email-validation').removeClass('valid').addClass('invalid');
			} else {
				$email.removeClass('error');
				$('#email-validation').removeClass('invalid').addClass('valid');
			}
		}
	};

	var form = {
		addListeners: function($fields, validationFunc){
			var $input = $fields.filter('input');
			var $infoWindow = $fields.filter('div.requirements');
			$fields.on('keyup change focus blur', function(){
				validationFunc();
			}).on('focus', function(){
				$infoWindow.show();
			}).on('blur', function(){
				$infoWindow.hide();
			});
		}
	};

	$('#search-contacts').find('#search-term').on('keyup', function(event){
		display.clear();
		display.loading();
		get.search();
	});

	$('#show-contact-form').on('click', function(){
		display.form("Add");
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
			contactRow.empty().append($('<td>').attr('colspan', 5).addClass('red-warning').text("Contact deleted successfully"));
			setTimeout(function(){contactRow.fadeOut(500, contactRow.remove);}, 2000);
			// display.message('Contact deleted successfully');
		});
	});

	$('#contact-list').on('click', '.edit-button', function(){
		display.form('Edit');
		var row = $(this).closest('tr');
		display.populateForm({
			id: row.attr('data-contact-id'), 
			first_name: row.find('.first-name').text(),
			last_name: row.find('.last-name').text(),
			email: row.find('.email').text()
		});
	});

	form.addListeners($('#contact-form').find('.first-name'),validate.firstName);
	form.addListeners($('#contact-form').find('.last-name'),validate.lastName);
	form.addListeners($('#contact-form').find('.email'),validate.email);

});
