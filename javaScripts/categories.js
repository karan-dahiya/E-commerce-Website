let showcaseArea = document.querySelector('.showcaseArea');
let container = document.querySelector('#frontScreen-container');

let product; // Define a global variable to hold the current product

function showExpandedCard(currentProduct) {
    product = currentProduct; // Assign the product to the global variable

    const expandedCard = document.querySelector('#expandedCard');
    const expandedContent = document.querySelector('#expandedContent');
    
    // Handle missing rating properties for expanded view
    const ratingRate = product.rating?.rate ?? 'N/A';
    const ratingCount = product.rating?.count ?? 'N/A';

    showcaseArea.style.display = 'none';
    container.style.display = 'none';
    // Set the content of the expanded view
    expandedContent.innerHTML = `
        <div class="container bigDisplay">
            <div id="imgDiv" style="display: flex; justify-content: center; align-items: center">
                <img src="${product.image}" class="card-img-top" alt="${product.title}">
            </div>
            <div id="dataDiv" class="row card-body">
                <div class="col">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text">Price: $${product.price}</p>
                <p class="card-text card-text-truncate-exp">Description:<br>${product.description}</p>
                <p class="card-text">Rating: ${ratingRate} (${ratingCount} reviews)</p>
                <div class="actions-container">
                    <button id="favouritesButton" class="favouritesButton">
                        Favourites <i class="bi bi-suit-heart"></i>
                    </button>   
                    <button id="add-to-cart-btn" class="add-to-cart-btn favToCart">Add to Cart</button>
                </div>
                </div>
            </div>
        </div>
        <p id="exchangeNote">Please note that all prices are listed in Canadian Dollars (CAD). Exchange rates will be applied at checkout.</p>
`;

    // Show the expanded card view
    expandedCard.classList.add('show');

    // Add event listeners for the buttons
    addEventListeners();
    addEventListenersFav();
}
// Function to close the expanded card view
function closeExpandedCard() {
    const expandedCard = document.querySelector('#expandedCard');
    expandedCard.classList.remove('show');
    showcaseArea.style.display = 'flex';
    container.style.display = 'flex';
}

// Add event listener to close button
document.querySelector('#closeBtn')?.addEventListener('click', closeExpandedCard);

// Event listener for product card clicks
document.querySelector('#frontScreen-container')?.addEventListener('click', function(e) {
    if (e.target.closest('.frontScreen-card')) {
        const card = e.target.closest('.frontScreen-card');
        const productId = card.getAttribute('data-id');

        fetch(`https://fakestoreapi.com/products/${productId}`)
            .then(res => res.json())
            .then(product => {
                showExpandedCard(product);
            })
            .catch(error => {
                console.error('Error fetching the product details:', error);
            });
    }
});

function addEventListeners() {
    // Get the add-to-cart button
    const addToCartButton = document.getElementById('add-to-cart-btn');
    
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            // Add your logic for handling add-to-cart here
        });
    }
}