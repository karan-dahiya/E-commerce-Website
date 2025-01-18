function defaultMain() {
    // Get reference to the output container
    const outputwindow = document.querySelector('#frontScreen-container');
    outputwindow.innerHTML = ''; // Clear previous content

    for (let i = 1; i < 21; i++) {
        fetch(`https://fakestoreapi.com/products/${i}`)
            .then(res => res.json())
            .then(json => {
                // Extract relevant data
                const { image, title, price, description, id } = json;

                // Create HTML for the front screen card
                const cardHtml = `
                    <div class="frontScreen-card" data-id="${id}">
                        <div class="frontScreen-image-wrapper">
                            <img src="${image}" alt="${title}">
                        </div>
                        <div class="frontScreen-card-details">
                            <h5 class="frontScreen-card-title card-text-truncate">${title}</h5>
                            <p class="frontScreen-card-text">Price: $${price}</p>
                            <p class="frontScreen-card-text card-text-truncate">${description}</p>
                        </div>
                    </div>`;
                
                // Append card HTML to the container
                outputwindow.innerHTML += cardHtml;
            })
            .catch(error => {
                console.error('Error fetching the product data:', error);
            });
    }
}

function fetchProducts(category) {
    fetch(`https://fakestoreapi.com/products/category/${category}`)
        .then(res => res.json())
        .then(json => {
            const outputwindow = document.querySelector('#frontScreen-container');
            outputwindow.innerHTML = ''; // Clear previous content

            json.forEach(product => {
                const { image, title, price, description, id } = product;
                outputwindow.innerHTML += `
                    <div class="frontScreen-card" data-id="${id}">
                        <div class="frontScreen-image-wrapper">
                            <img src="${image}" alt="${title}">
                        </div>
                        <div class="frontScreen-card-details">
                            <h5 class="frontScreen-card-title card-text-truncate">${title}</h5>
                            <p class="frontScreen-card-text">Price: $${price}</p>
                            <p class="frontScreen-card-text card-text-truncate">${description}</p>
                        </div>
                    </div>`;
            });
        })
        .catch(error => {
            console.error('Error fetching the product data:', error);
        });
}

// Initialize with default products
defaultMain();

// Event listener for nav items
document.querySelector('#men').addEventListener('click', function() {
    fetchProducts("men's clothing");
});

document.querySelector('#women').addEventListener('click', function() {
    fetchProducts("women's clothing");
});

document.querySelector('#electronics').addEventListener('click', function() {
    fetchProducts("electronics");
});

document.querySelector('#jewelery').addEventListener('click', function() {
    fetchProducts("jewelery");
});

// Event listener for dropdown items
document.querySelectorAll('#categoriesMenu .dropdown-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default link behavior
        const category = this.getAttribute('data-category');
        fetchProducts(category);
    });
});
// Event listener for dropdown items
document.querySelectorAll('#mobileDropdown .dd').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default link behavior
        const category = this.getAttribute('data-category');
        fetchProducts(category);
    });
});

document.querySelector('.bigLogo').addEventListener('click', function() {
    defaultMain();
});

