// Function to toggle the favourites screen
function toggleApi() {
    const getApiDiv = document.querySelector('#getApiDiv');

    if (getApiDiv.classList.contains('visible')) {
        // Close the favourites screen
        closeApi();
    } else {
        // Open the favourites screen
        showApi();
    }
}

// Function to show the favourites screen
function showApi() {
    const getApiDiv = document.querySelector('#getApiDiv');

    // Hide other content
    showcaseArea.style.display = 'none';
    container.style.display = 'none';
    
    // Set the content of the favourites view if needed
    getApiDiv.innerHTML = `
        <div class="apiHeader">
            <button class="close-btnApi" id="close-btnApi">&times;</button>
            <h2>Api Used</h2>
        </div>
        <div class="apiContainer">
        <div class="secondApi">
    <div class="api">
        <strong>Product id - Fake Store Api</strong>
        <a href="https://fakestoreapi.com" target="_blank">https://fakestoreapi.com</a>
    </div>
    <div class="api">
        <strong>Country Flags - Country Flags Api</strong>
        <a href="https://flagsapi.com" target="_blank">https://flagsapi.com</a>
    </div>
    <div class="api">
        <strong>Currency Exchange Rates - Latest Currency Api (GitHub)</strong>
        <a href="https://latest.currency-api.pages.dev/v1/currencies/" target="_blank">https://latest.currency-api.pages.dev/v1/currencies</a>
    </div>
    <div class="api">
        <strong>Geolocation - IP Api</strong>
        <a href="https://ip-api.com/" target="_blank">https://ip-api.com</a>
    </div>
    </div>
</div>

        `;

    // Show the favourites screen
    getApiDiv.classList.add('visible');
}

// Function to close the favourites screen
function closeApi() {
    const getApiDiv = document.querySelector('#getApiDiv');

    // Hide the favourites screen
    getApiDiv.classList.remove('visible');
    
    // Restore the previous content visibility
    showcaseArea.style.display = 'flex';
    container.style.display = 'flex';
}

// Add event listener for the toggle button
document.querySelector('.getApi').addEventListener('click', toggleApi);

document.querySelector('.getApiMobile').addEventListener('click', toggleApi);

// Add event listener for the close button in the find screen
document.querySelector('#getApiDiv')?.addEventListener('click', function(e) {
    if (e.target.id === 'close-btnApi') {
        closeApi();
    }
});




