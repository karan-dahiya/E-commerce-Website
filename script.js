document.addEventListener('DOMContentLoaded', function() {
    var toggleButton = document.getElementById('mobileTrigger');
    var dropdownMenu = document.getElementById('mobileDropdown');

    toggleButton.addEventListener('click', function() {
        // Toggle the 'show' class on the dropdown menu
        dropdownMenu.classList.toggle('show');
    });
});
