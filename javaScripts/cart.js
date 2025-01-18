let cartItems = [];
let buyNowBtn;
let buyerInfo;
let cardDetails;
let paymentMethod;
let defaultCurrency = 'CAD'; // Default to Canadian Dollar
const base_url = "https://latest.currency-api.pages.dev/v1/currencies/";

function toggleCart() {
    let zIndexCounter = 1000;
    if (cart.classList.contains('visible')) {
        cart.style.zIndex = --zIndexCounter; // Set unique z-index
        closeCart();
    } else {
        cart.style.zIndex = ++zIndexCounter; // Set unique z-index
        showCart();
    }
}

function closeCart() {
    cart.classList.remove('visible');
    showcaseArea.style.display = 'flex';
    container.style.display = 'flex';
}

function calculateTotalPrice() {
    return cartItems.reduce((total, item) => total + (parseFloat(item.price) * (item.quantity || 1)), 0).toFixed(2);
}
function updateFlag(element) {
    const currencyCode = element.value;
    const countryCode = countryList[currencyCode]?.code || 'US'; // Default to 'US' if not found
    const flagImage = document.querySelector('#currencyFlag');
    if (flagImage) {
        flagImage.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    }
}


function createCurrencySelector(selectedCurrency) {
    const currencies = Object.keys(countryList);
    const defaultCountryCode = countryList[selectedCurrency]?.code || 'US'; // Fallback to 'US' if not available
    return `
        <div class="form-group" id="currency">
            <label for="currencySelector">Select Currency:</label>
            <div class="currency-selector">
                <img id="currencyFlag" src="https://flagsapi.com/${defaultCountryCode}/flat/64.png" alt="Currency Flag" />
                <select id="currencySelector" class="form-control">
                    ${currencies.map(code => `
                        <option id="nameCode" value="${code}" ${code === selectedCurrency ? 'selected' : ''}>
                            ${countryList[code].name} (${code})
                        </option>
                    `).join('')}
                </select>
            </div>
        </div>
    `;
}async function fetchLocation() {
    try {
        const response = await fetch('http://ip-api.com/json/?fields=country,countryCode,region,regionName,city,zip');
        const data = await response.json();
        return {
            country: data.country,
            region: data.regionName,
            city: data.city,
            pincode: data.zip
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

async function populateAddressSelectors() {
    const location = await fetchLocation();
    
    if (location) {
        return `
          <div class="row" id="formRow">
            <div class="row" id="formRow">
                <label for="House">House/Flat No:</label>
                <input type="text" id="house" name="house" class="form-control" placeholder="123 abc street" required autocomplete="off">
            </div>
        </div>
        <div class="row" id="formRow">
            <div class="col-md-6 form-groupAdd" id="pincode">
                <label for="pincode">Pincode:</label>
                <input type="text" id="pincode" name="pincode" class="form-control" placeholder="Zip" required autocomplete="off">
                <div id="pincodePopup" class="suggestion-popup">
                    <p id="pincodeValue">${location.pincode}</p>
                </div>
            </div>
            <div class="col-md-6 form-groupAdd" id="city">
                <label for="city">City:</label>
                <input type="text" id="city" name="city" class="form-control" placeholder="City Name" required autocomplete="off">
                <div id="cityPopup" class="suggestion-popup">
                    <p id="cityValue">${location.city}</p>
                </div>
            </div>
        </div>
        <div class="row" id="formRow">
            <div class="col-md-6 form-groupAdd" id="region">
                <label for="Region">Region:</label>
                <input type="text" id="region" name="Region" class="form-control" placeholder="State/Province" required autocomplete="off">
                <div id="regionPopup" class="suggestion-popup">
                    <p id="regionValue">${location.region}</p>
                </div>
            </div>
            <div class="col-md-6 form-groupAdd" id="country">
                <label for="Country">Country:</label>
                <input type="text" id="Country" name="Country" class="form-control" placeholder="Country" required autocomplete="off">
                <div id="CountryPopup" class="suggestion-popup">
                    <p id="CountryValue">${location.country}</p>
                </div>
            </div>
        </div>
        `;
    } else {
        return `<p>Error: Unable to fetch location data.</p>`;
    }
}
function showPopup(popup) {
    // Hide all popups
    document.querySelectorAll('.suggestion-popup').forEach(p => p.style.display = 'none');
    
    // Show the relevant popup
    if (popup) {
        popup.style.display = 'block';
    }
}

function attachEventListeners() {
    const inputs = document.querySelectorAll('.form-groupAdd input');
    inputs.forEach(input => {
        const popupId = input.id + 'Popup';
        const popup = document.getElementById(popupId);
        
        if (popup) {
            input.addEventListener('focus', () => showPopup(popup));
            input.addEventListener('blur', () => {
                setTimeout(() => {
                    if (document.activeElement !== input) {
                        popup.style.display = 'none';
                    }
                }, 200);
            });
            popup.addEventListener('mousedown', () => {
                input.value = document.getElementById(input.id + 'Value').textContent;
                popup.style.display = 'none';
            });
        } else {
            console.error(`Popup with ID ${popupId} not found.`);
        }
    });
}

// Function to render the HTML into the DOM
async function renderCountrySelector() {
    const html = await populateAddressSelectors();
    const container = document.getElementById('address'); // Ensure this element exists
    if (container) {
        container.innerHTML = html;
        attachEventListeners();
    } else {
        console.error('Container element not found.');
    }
}




async function fetchConversionRate(fromCurrency, toCurrency) {
    const response = await fetch(`${base_url}${fromCurrency.toLowerCase()}.json`);
    const data = await response.json();
    return data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()];
}

async function showCart() {
    showcaseArea.style.display = 'none';
    container.style.display = 'none';

    const nameRegex = /^[A-Za-z]+$/;
        const phoneRegex = /^\d{1,10}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const houseRegex = /^[A-Za-z0-9]+$/;
        const locationRegex = /^[A-Za-z]+$/;
        const pincodeRegex = /^[A-Za-z0-9]+$/;
        const cardNumberRegex = /^\d{1,16}$/;
        const cvvRegex = /^\d{3}$/;

        // Function to validate the form
        function validateForm() {
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            const email = document.getElementById('email').value;
            const house = document.getElementById('house').value;
            const city = document.getElementById('city').value;
            const region = document.getElementById('region').value;
            const country = document.getElementById('Country').value;
            const pincode = document.getElementById('pincode').value;
            const cardNumber = document.getElementById('cardNumber').value;
            const cvv = document.getElementById('cvv').value;
            const errorMsg = document.querySelector(".errorMsg");
            errorMsg.style.color = 'red';


       // Check for empty fields
            if (!firstName || !lastName || !phoneNumber || !email || !house || !city || !region || !country || !pincode || !cardNumber || !cvv) {
                errorMsg.textContent = 'All fields must be filled out.';
                return false;
            }
            // Validate inputs
            if (!nameRegex.test(firstName)) {
                errorMsg.textContent = 'First Name can only contain letters.';
                return false;
            }
            if (!nameRegex.test(lastName)) {
                errorMsg.textContent = 'Last Name can only contain letters.';
                return false;
            }
            if (!phoneRegex.test(phoneNumber)) {
                errorMsg.textContent = 'Phone Number can only contain up to 10 digits.';
                return false;
            }
            if (!emailRegex.test(email)) {
                errorMsg.textContent = 'Please enter a valid email address.';
                return false;
            }
            if (!houseRegex.test(house)) {
                errorMsg.textContent = 'House Number can only contain letters and numbers.';
                return false;
            }
            if (!locationRegex.test(city) || !locationRegex.test(region) || !locationRegex.test(country)) {
                errorMsg.textContent = 'City, Region, and Country can only contain letters.';
                return false;
            }
            if (!pincodeRegex.test(pincode)) {
                errorMsg.textContent = 'Pincode can only contain letters and numbers.';
                return false;
            }
            if (!cardNumberRegex.test(cardNumber)) {
                errorMsg.textContent = 'Card Number can contain up to 16 digits.';
                return false;
            }
            if (!cvvRegex.test(cvv)) {
                errorMsg.textContent = 'CVV must be exactly 3 digits.';
                return false;
            }

            // Form is valid
            return true;
        }

    if (cartItems.length === 0) {
        cart.innerHTML = `
            <button class="close-btnCart" id="closeCartBtn">Keep Shopping</button>
            <h2>Your Cart</h2>
            <div class="container">
                <div class="row">
                    <div class="col printhere d-flex flex-column justify-content-center align-items-center p-2">
                        <i class="bi bi-cart"></i>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        const cartContent = cartItems.map((item, index) => `
            <div class="col m-1" id="cartCards">
                <div class="card" id="cartDisplay">
                    <div id="imgDivCart">
                        <img src="${item.image}" class="card-img-top" alt="${item.title}">
                    </div>
                    <div class="card-body" id="cartCardStyles">
                        <h5 class="card-title card-text-truncate">${item.title}</h5>
                        <p class="card-text card-text-truncate">Price: $${parseFloat(item.price).toFixed(2)}</p>
                        <p class="card-text card-text-truncate">Quantity: ${item.quantity || 1}</p>
                    </div>
                    <div id="removeProductDiv">
                        <button class="removeProduct" data-index="${index}">&times;</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        const totalPriceCAD = calculateTotalPrice();
        const conversionRate = await fetchConversionRate('CAD', defaultCurrency);
        const totalPriceInDefaultCurrency = (totalPriceCAD * conversionRate).toFixed(2);
        // Call the function to render the country selector
        renderCountrySelector();
        const formContent = `
            <div class="container" id="buyForm">
                ${createCurrencySelector(defaultCurrency)}

                <hr id="formHr">
                <div class="row" id="formRow">
                    <div class="col-md-6 form-group">
                        <label for="firstName">First Name:</label>
                        <input type="text" id="firstName" name="firstName" class="form-control" placeholder="Given Name" required autocomplete="off">
                    </div>
                    <div class="col-md-6 form-group">
                        <label for="lastName">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" class="form-control" placeholder="Surname" required autocomplete="off">
                    </div>
                </div>
                <div class="row" id="formRow">
                    <div class="col-md-6 form-group">
                        <label for="phoneNumber">Phone Number:</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" class="form-control" placeholder="+1-234-567-8901" required autocomplete="off">
                    </div>
                    <div class="col-md-6 form-group">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" class="form-control" placeholder="example@example.com" required autocomplete="off">
                    </div>
                </div>
                <hr id="formHr">
                <div class="row" id="formRow">
                    <p>Add your Shipping Address: </p>
                </div>
                <div id="address">
                </div>
                <hr id="formHr">
                <div class="row" id="formRow">
                    <p>Payments</p>
                </div>
                <div class="row" id="formRow">
                    <div class="col-12 form-group">
                        <label for="paymentMethod">Payment Method:</label>
                        <select id="paymentMethod" name="paymentMethod" class="form-control" required>
                            <option value="" disabled selected hidden>Select</option>
                            <option value="masterCard">MasterCard</option>
                            <option value="visa">Visa</option>
                            <option value="americanExpress">American Express</option>
                        </select>
                    </div>
                </div>
                <div class="row" id="cardDetails" style="display: none;">
                    <div class="col-md-6 form-group">
                        <label for="cardNumber">Card Number:</label>
                        <input type="text" id="cardNumber" name="cardNumber" class="form-control" placeholder="1234 5678 9012 3456" required autocomplete="off">
                    </div>
                    <div class="col-md-6 form-group">
                        <label for="cvv">CVV:</label>
                        <input type="text" id="cvv" name="cvv" class="form-control" placeholder="123" required autocomplete="off">
                    </div>
                </div>
                <div class="row" id="formRow">
                    <!-- Checkout Button HTML -->
                    <div class="col-12 text-center" id="checkoutBtn">
                    <p class="errorMsg"></p>
                    <button type="button" class="btn btn-primary" id="openCheckoutModalBtn">Checkout</button>
                    </div>
            </div>
        `;

        cart.innerHTML = `
            <div class="cart-content">
                <button class="close-btnCart" id="closeCartBtn">Keep Shopping</button>
                <h2>Your Cart</h2>
                <div id="mainProductsCardsCart">
                    <div id="productsCardsCart">
                        ${cartContent}
                    </div>
                </div>
                <div id="cartTotal">
                    <h5>Total Price: $${totalPriceCAD} (${defaultCurrency} ${totalPriceInDefaultCurrency})</h5>
                    <button type="button" class="btn btn-success" id="buyNowBtn">Buy Now!</button>
                </div>
                <div id="buyerInfo" style="display: none;">
                    <h2>Complete Your Purchase</h2>
                    <form id="purchaseForm">
                    ${formContent}
                    </form>
                </div>
            </div>
        `;

        // Reassign variables to ensure they are always up-to-date
        buyNowBtn = document.querySelector('#buyNowBtn');
        buyerInfo = document.querySelector('#buyerInfo');
        cardDetails = document.querySelector('#cardDetails');
        paymentMethod = document.querySelector('#paymentMethod');

        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', handleBuyNowClick);
        }

        if (paymentMethod) {
            paymentMethod.addEventListener('change', handlePaymentMethodChange);
        }

        const currencySelector = document.querySelector('#currencySelector');
        if (currencySelector) {
            // Initialize flag
            updateFlag(currencySelector);

            currencySelector.addEventListener('change', async (event) => {
                const selectedCurrency = event.target.value;
                const conversionRate = await fetchConversionRate('CAD', selectedCurrency);
                const newTotalPrice = (totalPriceCAD * conversionRate).toFixed(2);
                document.querySelector('#cartTotal h5').innerHTML = `Total Price: $${totalPriceCAD} (${selectedCurrency} ${newTotalPrice})`;
                
                // Update the flag when currency changes
                updateFlag(event.target);
            });
        }
        document.getElementById('openCheckoutModalBtn').addEventListener('click', async function() {
             // Perform form validation before proceeding
             if (!validateForm()) {
                event.preventDefault(); // Prevent the default action if validation fails
                return; // Stop further execution
            }
            // Define the modal HTML structure with user and checkout information
            const selectedCurrency = currencySelector ? currencySelector.value : 'USD';
      const conversionRate = await fetchConversionRate('CAD', selectedCurrency);
      const conversionRateUse = parseFloat(conversionRate);
      const newTotalPrice = parseFloat((totalPriceCAD * conversionRate).toFixed(2));
      const tax = (newTotalPrice *0.12).toFixed(2);
      const shipping = (5* conversionRateUse).toFixed(2);
      let taxDeductionPrice = tax + newTotalPrice;
      let finalAmount = (parseFloat(taxDeductionPrice) + parseFloat(shipping) + parseFloat(newTotalPrice)).toFixed(2);
        
     
            const modalHTML = `
              <div class="modal fade" id="checkoutModal" tabindex="-1" aria-labelledby="checkoutModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="checkoutModalLabel">Final Checkout</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <h5>Order Summary</h5>
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th>Details</th>
                          </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>Total Price in Default Currency</td>
                            <td>${defaultCurrency} ${totalPriceInDefaultCurrency}</td>
                          </tr>
                          <tr>
                            <td>Total Price</td>
                            <td>${selectedCurrency} ${newTotalPrice}</td>
                          </tr>
                          
                          <tr>
                            <td>Taxes Deduction</td>
                            <td>12% (${selectedCurrency} ${tax})</td>
                          </tr>
                          <tr>
                            <td>Shipping</td>
                            <td>$5.00 (${selectedCurrency} ${shipping})</td>
                          </tr>
                          <tr>
                            <td><strong>Total Amount</strong></td>
                            <td><strong>${selectedCurrency} ${finalAmount}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                      <h5>User Information</h5>
                      <ul class="list-unstyled">
                        <li><strong>Name:</strong> ${firstName.value}</li>
                        <li><strong>Phone Number:</strong> ${phoneNumber.value}</li>
                        <li><strong>Address:</strong> ${house.value} ${cityValue.textContent}, ${pincodeValue.textContent}  </li>
                        <li><strong>Payment Type:</strong> ${paymentMethod.value}</li>
                        <li><strong>Card Number:</strong> ********${cardNumber.value.slice(-4)}</li>
                      </ul>
                      <div class="confirmOrder">
                        <p>Your Order have been successfully placed.</p>
                    </div>
                    </div>
                    
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" id="closeForm" data-bs-dismiss="modal">Close</button>
                      <button type="button" class="btn btn-primary" id="confirmBee">Confirm Purchase</button>
                    </div>
                  </div>
                </div>
              </div>
            `;
            
            // Create a new div element and set its innerHTML to the modal HTML
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHTML;
      
            // Append the modal container to the body
            document.body.appendChild(modalContainer);
      
            // Initialize and show the modal
            const modalElement = document.getElementById('checkoutModal');
            const modalInstance = new bootstrap.Modal(modalElement);
            modalInstance.show();

            // Variable to keep track of whether "Confirm" has been clicked
let confirmClicked = false;

// Event listener for the "Confirm" button
document.getElementById('confirmBee').addEventListener('click', function() {
    // Display the confirmation order box
    document.querySelector('.confirmOrder').style.display = 'block';
    // Set the flag to true indicating "Confirm" was clicked
    confirmClicked = true;
});

// Event listener for the "Close" button
document.querySelector('#closeForm').addEventListener('click', function() {
    // Check if the "Confirm" button was previously clicked
    if (confirmClicked) {
        // Remove the product from the cart
        removeProductFromCart();
        // Reset the flag
        confirmClicked = false;
    }
    // Hide the confirmation order box (optional)
    document.querySelector('.confirmOrder').style.display = 'none';
});
                        
          });
    }
    


    cart.classList.add('visible');
    // Reassign variables to ensure they are always up-to-date
    buyNowBtn = document.querySelector('#buyNowBtn');
    buyerInfo = document.querySelector('#buyerInfo');
    cardDetails = document.querySelector('#cardDetails');
    paymentMethod = document.querySelector('#paymentMethod');

    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', handleBuyNowClick);
    }

    if (paymentMethod) {
        paymentMethod.addEventListener('change', handlePaymentMethodChange);
    }
}


function handlePaymentMethodChange() {
    const selectedPaymentMethod = paymentMethod.value;
    if (selectedPaymentMethod === 'visa' || selectedPaymentMethod === 'masterCard' || selectedPaymentMethod === 'americanExpress') {
        cardDetails.style.display = 'flex';
    } else {
        cardDetails.style.display = 'none';
    }
}

function handleBuyNowClick() {
    if (buyerInfo.style.display === 'none') {
        // Show the buyer information form and change button to "Cancel"
        buyerInfo.style.display = 'flex';
        buyNowBtn.textContent = 'Cancel';
        buyNowBtn.classList.remove('btn-success');
        buyNowBtn.classList.add('btn-cancel');
        buyNowBtn.removeEventListener('click', handleBuyNowClick);
        buyNowBtn.addEventListener('click', handleCancelClick);
    } else {
        // Hide the buyer information form and change button back to "Buy Now"
        buyerInfo.style.display = 'none';
        buyNowBtn.textContent = 'Buy Now!';
        buyNowBtn.classList.remove('btn-cancel');
        buyNowBtn.classList.add('btn-success');
        buyNowBtn.removeEventListener('click', handleCancelClick);
        buyNowBtn.addEventListener('click', handleBuyNowClick);
    }
}

function handleCancelClick() {
    buyerInfo.style.display = 'none';
    buyNowBtn.textContent = 'Buy Now!';
    buyNowBtn.classList.remove('btn-cancel');
    buyNowBtn.classList.add('btn-success');
    buyNowBtn.removeEventListener('click', handleCancelClick);
    buyNowBtn.addEventListener('click', handleBuyNowClick);
}

function addProductToCart(product) {
    if (!product) {
        console.error('Product is not defined');
        return;
    }

    const existingProduct = cartItems.find(item => item.id === product.id);
    if (existingProduct) {
        console.log('Product already in cart');
        return;
    }

    cartItems.push(product);
}


function removeProductFromCart(index) {
        cartItems.splice(index, 1);
        showCart(); // Update cart view immediately
}

function addEventListeners() {
    document.getElementById('add-to-cart-btn')?.addEventListener('click', function () {
        if (typeof product !== 'undefined') {
            addProductToCart(product);
    
            // Show confirmation message with animation
            showConfirmationMessage('Product Added to Cart');
        } else {
            console.error('Product is not defined');
        }
    });
    
    function showConfirmationMessage(message) {
        const confirmationElement = document.createElement('div');
        confirmationElement.className = 'confirmation-message';
        confirmationElement.innerText = message;
    
        // Append the message to the body or a specific container
        document.body.appendChild(confirmationElement);
    
        // Add animation class
        setTimeout(() => {
            confirmationElement.classList.add('show');
        }, 0);
        
        // Remove message after animation
        setTimeout(() => {
            confirmationElement.classList.remove('show');
            setTimeout(() => {
                confirmationElement.remove();
            }, 500); // Wait for animation to complete before removing element
        }, 2000); // Duration of message display

        let addButton = document.querySelector('.add-to-cart-btn');
        addButton.textContent = "Added to Cart";
        addButton.classList.add('added');

        // Reset button text after a delay
        setTimeout(() => {
            addButton.textContent = 'Add to Cart';
            addButton.classList.remove('added');
        }, 5000);
    }
    
    document.querySelector('#cart')?.addEventListener('click', function (e) {
        if (e.target.classList.contains('removeProduct')) {
            const index = e.target.getAttribute('data-index');
            removeProductFromCart(parseInt(index, 10));
        }
    });
}

document.querySelector('#toggleCart')?.addEventListener('click', toggleCart);
document.querySelector('#cart')?.addEventListener('click', function (e) {
    if (e.target.id === 'closeCartBtn') {
        closeCart();
    }
});

// Ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#purchaseForm');
    
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission
            // Optionally, you can add your form submission logic here (e.g., AJAX request)
        });
    }
});

function addProductToCartAndRemoveFromFav(index) {
    if (index >= 0 && index < favItems.length) {
        const product = favItems[index];
        addProductToCart(product);
        removeProductFromCartFav(index); // Remove from favourites list
    } else {
        console.error('Invalid product index');
    }
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


addEventListeners();
