// Function to handle user deletion
function deleteUser(userUniqueId) {
	if (confirm("Are you sure you want to delete this user?")) {
		// Send a DELETE request to the server
		fetch(`/user/delete/${userUniqueId}`, {
			method: 'DELETE'
		})
		.then(response => {
			if (response.ok) {
				// User deleted successfully, reload the page
				location.reload();
			} else {
				// Handle error case
				alert('Failed to delete user. Please try again.');
			}
		})
		.catch(error => {
			console.error('Error:', error);
			alert('An error occurred. Please try again.');
		});
	}
}

// Function to handle form submission for adding a new user
function addUser(event) {
	event.preventDefault(); // Prevent form submission
	// Get form values
	const userName = document.getElementById('userName').value;
	const userEmail = document.getElementById('userEmail').value;
	const userAge = document.getElementById('userAge').value;

	// Create user object
	const user = {
		userName: userName,
		userEmail: userEmail,
		userAge: userAge
	};

	// Send a POST request to the server
	fetch('/user/add', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(user)
	})
	.then(response => {
		if (response.ok) {
			// User added successfully, reload the page
			location.reload();
		} else {
			// Handle error case
			alert('Failed to add user. Please try again.');
		}
	})
	.catch(error => {
		console.error('Error:', error);
		alert('An error occurred. Please try again.');
	});
}

// Function to handle user edit
function editUser(userUniqueId) {
	// Redirect to the edit page with the user's unique ID
	window.location.href = `/user/edit/${userUniqueId}`;
}