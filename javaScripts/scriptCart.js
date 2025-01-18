// scriptCart.js

// Example cart items (in a real application, these might come from an API or local storage)
const cartItems = [
    { name: 'Item 1', price: 10.00, quantity: 2 },
    { name: 'Item 2', price: 15.00, quantity: 1 },
    { name: 'Item 3', price: 7.50, quantity: 3 },
];

// Function to update the cart display
function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = ''; // Clear existing items

    let total = 0;
    cartItems.forEach(item => {
        total += item.price * item.quantity;
        cartContainer.innerHTML += `
            <div class="cart-item">
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">x${item.quantity}</div>
                <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `;
    });

    document.getElementById('total-price').innerText = total.toFixed(2);
}

// Function to handle checkout button click
document.getElementById('checkout-button').addEventListener('click', function() {
    document.getElementById('checkout-form').style.display = 'block';
});

// Function to handle form submission
document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission
    
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('payment-method').value;

    alert(`Thank you, ${name}! Your order will be shipped to ${address} and paid via ${paymentMethod}.`);

    // Clear the cart and hide the form
    cartItems.length = 0; // Empty the cart
    updateCart();
    document.getElementById('checkout-form').style.display = 'none';
});

// Initial cart update
updateCart();
