// Function to toggle the favourites screen
function toggleFavourites() {
    const favourites = document.querySelector('#favourites');
    let zIndexCounter = 1000;
    if (favourites.classList.contains('visible')) {
        // Close the favourites screen
        favourites.style.zIndex = --zIndexCounter;
        closeFavourites();
        
    } else {
        favourites.style.zIndex = ++zIndexCounter; // Set unique z-index
        // Open the favourites screen
        showFav();
    }
}

// Function to close the favourites screen
function closeFavourites() {
    const favourites = document.querySelector('#favourites');

    // Hide the favourites screen
    favourites.classList.remove('visible');
    
    // Restore the previous content visibility
    showcaseArea.style.display = 'flex';
    container.style.display = 'flex';
}

function addProductToFav(product) {
    if (!product) {
        console.error('Product is not defined');
        return;
    }

    const existingProductFav = favItems.find(item => item.id === product.id);
    if (existingProductFav) {
        console.log('Product already in Fav');
        return;
    }

    favItems.push(product);
}
// Function to add a product to cart and remove from favourites
function addProductToCartAndRemoveFromFav(index) {
        const product = favItems[index];
        addProductToCart(product);
        removeProductFromCartFav(index); // Remove from favourites list
}
// Add event listener for the toggle button
document.querySelector('#toggleFavourites')?.addEventListener('click', toggleFavourites);

// Add event listener for the close button in the favourites screen
document.querySelector('#favourites')?.addEventListener('click', function(e) {
    if (e.target.id === 'closeFavouritesBtn') {
        closeFavourites();
    }
});


// //////////////////////////////  Add Item to favourites ////////////////////////////// //
let favItems = [];

async function showFav() {
    showcaseArea.style.display = 'none';
    container.style.display = 'none';
    let fav = document.querySelector("#favourites");
    if (favItems.length === 0) {
        fav.innerHTML = `
            <button class="close-btnFav" id="closeFavouritesBtn">Keep Shopping</button>
        <div id="headerFavourites">    
            <h2>Your Favourites</h2>
        </div>
        <div class="container">
            <div class="row">
                <div class="col" id="productArea">
                    <i class="bi bi-list-stars"></i>
                    <p>No Favourites</p>
                </div>
            </div>
        </div>
        `;
    } else {
        const favContent = favItems.map((item, index) => `
                <div class="frontScreen-card" id="favCardSt">
                    <div id="frontScreen-image-wrapper">
                        <img src="${item.image}" class="card-img-top" alt="${item.title}">
                    </div>
                    <div class="frontScreen-card-details">
                        <h5 class="frontScreen-card-title card-text-truncate">${item.title}</h5>
                        <p class="frontScreen-card-text card-text-truncate">Price: $${parseFloat(item.price).toFixed(2)}</p>
                        <p class="frontScreen-card-text card-text-truncate">Quantity: ${item.quantity || 1}</p>
                    </div>
                    <div id="removeProductDivFav">
                        <button id="addToCart" class="addToCart" data-index="${index}"><i class="bi bi-cart-fill"></i></button>
                        <button class="removeProductFav" data-index="${index}"><i class="bi bi-x"></i></button>
                    </div>
                </div>
        `).join('');

        fav.innerHTML = `
            <div class="fav-content">
                <button class="close-btnFav" id="closeFavouritesBtn">Keep Shopping</button>
                <div id="headerFavourites">    
            <h2>Your Favourites</h2>
        </div>
        <div class="favCardStyleMain">
            <div id="frontScreen-container" class="favCardStyle">
                        ${favContent}
            </div>
        </div>
        `;
    }
    fav.classList.add('visible');
}


function removeProductFromCartFav(index) {
        favItems.splice(index, 1);
        showFav(); // Update cart view immediately
}

function addEventListenersFav() {
    document.querySelector('#favouritesButton').addEventListener('click', function () {
        if (typeof product !== 'undefined') {
            addProductToFav(product);
            // Show confirmation message with animation
            showConfirmationMessage('Added to Favourites');
            
        } else {
            console.error('Product is not defined');
        }
    });
    
    function showConfirmationMessage(message) {
        const confirmationElement = document.createElement('div');
        confirmationElement.className = 'confirmation-messageFav';
        confirmationElement.innerText = message;
    
        // Append the message to the body or a specific container
        document.body.appendChild(confirmationElement);
    
        // Add animation class
        setTimeout(() => {
            confirmationElement.classList.add('showFav');
        }, 0);
        
        // Remove message after animation
        setTimeout(() => {
            confirmationElement.classList.remove('showFav');
            setTimeout(() => {
                confirmationElement.remove();
            }, 500); // Wait for animation to complete before removing element
        }, 2000); // Duration of message display

        let addButton = document.querySelector('.favouritesButton');
        addButton.textContent = "Added to Favourites";
        addButton.classList.add('favorited');

        // Reset button text after a delay
        setTimeout(() => {
            addButton.innerHTML = `Favourites <i class="bi bi-suit-heart-fill"></i>`;
            addButton.classList.remove('.favorited');
        }, 5000);
    }

    document.querySelector('#favourites')?.addEventListener('click', function (e) {
        if (e.target.classList.contains('addToCart')) {
            const index = e.target.getAttribute('data-index');
            addProductToCartAndRemoveFromFav(parseInt(index, 10));
        }

        if (e.target.classList.contains('removeProductFav')) {
            const index = e.target.getAttribute('data-index');
            removeProductFromCartFav(parseInt(index, 10));
        }
    });
}



