window.addEventListener('DOMContentLoaded', (event) => {
    const messageElement = document.getElementById('home-success-message');
    if (messageElement) {
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000); // Hide the message after 5 seconds
    }
});