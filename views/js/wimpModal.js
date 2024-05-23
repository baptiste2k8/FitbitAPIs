// Clear form fields when modal is shown
$('#wimpModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);

    var uniqueID=button.data("wimp-id");
    var heartbeat = button.data("wimp-heartbeat");
    var receivedOn = button.data("wimp-receivedon");
    var buddyPayload = button.data("wimp-buddypayload");
    var buddyPayloadExecutionStatus = button.data("wimp-buddypayloadexecutionstatus");
    var notificationMessage = button.data("wimp-notificationmessage");
    var notificationDeliveryStatus = button.data("wimp-notificationdeliverystatus");
    var modal = $(this);
    modal.find('#wimpId').val(uniqueID);
    modal.find('#wimpHeartbeat').val(heartbeat);
    modal.find('#wimpReceivedon').val(receivedOn);
    modal.find('#wimpBuddypayload').val(buddyPayload);
    modal.find('#wimpBuddypayloadexecutionstatus').val(buddyPayloadExecutionStatus);
    modal.find('#wimpNotificationmessage').val(notificationMessage);
    modal.find('#wimpNotificationdeliverystatus').val(notificationDeliveryStatus);
});

// Clear form fields when modal is hidden
$('#wimpModal').on('hidden.bs.modal', function () {
    var modal = $(this);
    modal.find('#wimpForm')[0].reset();
});

// Function to handle user save (create/update)
function saveWimp(event) {
    event.preventDefault(); // Prevent form submission 
    // Get form values   
    var uniqueID = document.getElementById('wimpId').value;
    var heartbeat = document.getElementById('wimpHeartbeat').value;
    var receivedOn = document.getElementById('wimpReceivedon').value;
    var buddyPayload = document.getElementById('wimpBuddypayload').value;
    var buddyPayloadExecutionStatus = document.getElementById('wimpBuddypayloadexecutionstatus').value;
    var notificationMessage = document.getElementById('wimpNotificationmessage').value;
    var notificationDeliveryStatus = document.getElementById('wimpNotificationdeliverystatus').value;
   // Create wimp object
	var wimp = {
		heartbeat: heartbeat,
		receivedOn: receivedOn,
		buddyPayload: buddyPayload,
		buddyPayloadExecutionStatus: buddyPayloadExecutionStatus,
		notificationMessage: notificationMessage,
		notificationDeliveryStatus: notificationDeliveryStatus
	};
    if (uniqueID) {
        // Update existing wimp entry
        wimp.uniqueID = uniqueID;
        fetch(`/wimp/update/${uniqueID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(wimp)
        })
        .then(response => {
            if (response.ok) {
                // wimp request updated successfully, reload the page
                location.reload();
            } else {
                // Handle error case
                alert('Failed to update wimp request. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    } else {
        // Create new wimp entry
        fetch('/wimp/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(wimp)
            
        })
        .then(response => {
            if (response.ok) {
                // Wimp added successfully, reload the page
                location.reload();
                
            } else {
                // Handle error case
                alert('Failed to add wimp request. Please try again.');
                
                
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error);
            alert('An error occurred. Please try again.');
        });
    }
}