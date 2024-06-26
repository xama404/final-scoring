// Handle form submission for adding collection
document.getElementById('addCollectionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var name = document.getElementById('collectionName').value;

    fetch('/add-collection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Handle form submission for adding task
document.getElementById('addTaskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var name = document.getElementById('taskTitle').value;
    var collections_id = document.getElementById('collectionId').value;

    fetch('/add-task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name, collections_id: collections_id }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
