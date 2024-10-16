// Function to toggle the cart modal
function toggleCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    } else {
        console.error("Error: Cart modal not found!");
    }
}

// Function to toggle the payment modal
function togglePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    } else {
        console.error("Error: Payment modal not found!");
    }
}

// Function to close the payment modal
function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error("Error: Payment modal not found!");
    }
}

// Add item to the cart
function addToCart(productName, price) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product already exists in the cart
    const existingProduct = cartItems.find(item => item.name === productName);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        const newProduct = { name: productName, price: price, quantity: 1 };
        cartItems.push(newProduct);
    }

    // Save the cart to localStorage and update the display
    localStorage.setItem('cart', JSON.stringify(cartItems));
    displayCart();
}

// Remove a single item from the cart
function removeFromCart(productName) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems = cartItems.filter(item => item.name !== productName);

    localStorage.setItem('cart', JSON.stringify(cartItems));
    displayCart();
}

// Display the cart contents
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('total');
    const cartCount = document.getElementById('cart-count');

    cartItemsContainer.innerHTML = '';
    let total = 0;
    let itemCount = 0;

    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`;

        // Create a trash icon as the remove button
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
        removeBtn.classList.add('remove-btn');
        removeBtn.style.background = 'none';
        removeBtn.style.border = 'none';
        removeBtn.style.color = '#d4a373';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.fontSize = '1.2rem';
        removeBtn.addEventListener('click', () => removeFromCart(item.name));

        li.appendChild(removeBtn);
        cartItemsContainer.appendChild(li);

        total += item.price * item.quantity;
        itemCount += item.quantity;
    });

    totalElement.textContent = `Total: $${total.toFixed(2)}`;
    cartCount.textContent = itemCount;
}

// Clear the cart
function clearCart() {
    localStorage.removeItem('cart');
    displayCart();
}

// Checkout button opens the payment modal
function checkout() {
    togglePaymentModal();
}

// Initialize and display the cart on page load
window.onload = displayCart;

// Event listener for opening the cart modal
document.getElementById('cart-icon').addEventListener('click', toggleCartModal);

// Event listener for clearing the cart
document.querySelector('.clear-cart-btn').addEventListener('click', clearCart);

// Event listener for opening the payment modal when clicking "Buy Now"
document.querySelector('.buy-now-btn').addEventListener('click', checkout);

// Background Image Slideshow
const images = [
    'images/background.jpg',
    'images/background1.jpg',
    'images/background2.jpg',
    'images/background3.jpg',
    'images/background4.jpg',
    'images/background5.jpg',
    'images/background6.jpg',
    'images/background7.jpg',
];

let currentIndex = 0;
const heroSection = document.getElementById('hero');

// Function to change background image
function changeBackground() {
    heroSection.style.backgroundImage = `url(${images[currentIndex]})`;
    currentIndex = (currentIndex + 1) % images.length;
}

// Start cycling through images every 5 seconds
setInterval(changeBackground, 5000);

// Event listener to close the payment modal
document.querySelector('.close-btn').addEventListener('click', closePaymentModal);


// JavaScript for form submission and feedback handling
document.getElementById('contact-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
  
    try {
      const response = await fetch('http://localhost:3000/send-email', {  // Updated URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });
  
      if (response.ok) {
        document.getElementById('success-message').classList.remove('hidden');
        document.getElementById('error-message').classList.add('hidden');
        document.getElementById('contact-form').reset();
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      document.getElementById('error-message').classList.remove('hidden');
      document.getElementById('success-message').classList.add('hidden');
    }
  });
  