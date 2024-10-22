document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('timeEntryForm');
    const entriesList = document.getElementById('entriesList');

    // Load entries on page load
    loadEntries();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const description = document.getElementById('description').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;

        const response = await fetch('/api/entries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description, start_time: startTime, end_time: endTime }),
        });

        if (response.ok) {
            form.reset();
            loadEntries();
        } else {
            console.error('Error adding entry');
            alert('Failed to add entry. Please try again.');
        }
    });

    async function loadEntries() {
        try {
            const response = await fetch('/api/entries');
            const data = await response.json();

            entriesList.innerHTML = '';

            if (Array.isArray(data) && data.length > 0) {
                data.forEach(entry => {
                    const entryElement = document.createElement('div');
                    entryElement.classList.add('entry');
                    entryElement.innerHTML = `
                        <p><strong>Description:</strong> ${entry.description}</p>
                        <p><strong>Start Time:</strong> ${new Date(entry.start_time).toLocaleString()}</p>
                        <p><strong>End Time:</strong> ${new Date(entry.end_time).toLocaleString()}</p>
                    `;
                    entriesList.appendChild(entryElement);
                });
            } else {
                entriesList.innerHTML = '<p>No entries found.</p>';
            }
        } catch (error) {
            console.error('Error loading entries:', error);
            entriesList.innerHTML = '<p>Error loading entries. Please try again later.</p>';
        }
    }
});