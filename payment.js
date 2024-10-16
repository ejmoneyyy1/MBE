const stripe = Stripe('pk_test_51Q8l4IBbtBGrTlbjZdcf6tDZJuhAbgkSCX5wycO3qcQeJZEEr7Zg8yDRCYfGloP3v2bvk6VisrA9cPUCZ7J1P55k00qjcVj9Vm'); // Your public Stripe key


function getCartData() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

async function createCheckoutSession() {
    try {
        const response = await fetch('http://localhost:3001/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: getCartData() // Assuming this function fetches the cart data
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create checkout session');
        }

        const { id: sessionId } = await response.json();

        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({ sessionId });
        if (result.error) {
            console.error('Stripe error:', result.error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to create checkout session: ' + error.message);
    }
}

document.querySelector('.buy-now-btn').addEventListener('click', createCheckoutSession);
