// Clear form fields when modal is shown
$('#userModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var userId = button.data('user-id');
    var userName = button.data('user-name');
    var userEmail = button.data('user-email');
    var userAge = button.data('user-age');
    var modal = $(this);
    modal.find('#userId').val(userId);
    modal.find('#userName').val(userName);
    modal.find('#userEmail').val(userEmail);
    modal.find('#userAge').val(userAge);
});

// Clear form fields when modal is hidden
$('#userModal').on('hidden.bs.modal', function () {
    var modal = $(this);
    modal.find('#userForm')[0].reset();
});

// Function to handle user save (create/update)
function saveUser(event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    var userId = document.getElementById('userId').value;
    var userName = document.getElementById('userName').value;
    var userEmail = document.getElementById('userEmail').value;
    var userAge = document.getElementById('userAge').value;

    // Create user object
    var user = {
        userName: userName,
        userEmail: userEmail,
        userAge: userAge
    };

    if (userId) {
        // Update existing user
        user.userUniqueId = userId;
        fetch(`/user/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => {
            if (response.ok) {
                // User updated successfully, reload the page
                location.reload();
            } else {
                // Handle error case
                alert('Failed to update user. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    } else {
        // Create new user
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
}