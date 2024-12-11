document.addEventListener('DOMContentLoaded', Onload);

function Onload() {
    const closebutton = document.getElementById('close-card-btn');

    if (closebutton) {
        closebutton.addEventListener('click', handleCloseCard);
    }
}

function handleCloseCard(event) {
    // Use 'this' to refer to the button that was clicked
    this.closest('.advertisement-card').remove();
}
