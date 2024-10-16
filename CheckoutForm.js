import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for capturing the customer input
  const [email, setEmail] = useState(''); // Ensure email starts as an empty string

<input
  type="email"
  placeholder="Your Email"
  value={email} // Dynamically bound to email state
  onChange={(e) => setEmail(e.target.value)}
  required
/>

  const [name, setName] = useState('');
  const [address, setAddress] = useState({
    line1: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US', // Default to US; this can be modified
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Create a Payment Intent on the server
      const { data: { clientSecret } } = await axios.post('http://localhost:3001/create-payment-intent', {
        amount: 5000, // Replace with dynamic amount from the cart
        shipping: {
          name: name,
          address: {
            line1: address.line1,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            country: address.country,
          },
        },
        email: email, // Send email to the backend
      });

      const cardElement = elements.getElement(CardElement);

      // Confirm the card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: name,
            email: email, // Captured email
          },
        },
        shipping: {
          name: name,
          address: {
            line1: address.line1,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            country: address.country,
          },
        },
      });

      if (error) {
        setError(error.message);
        console.error("Payment error:", error);
      } else {
        setPaymentSuccess(true);
        setError(null);
        console.log("Payment successful:", paymentIntent);
        // Redirect to a success page or clear form
      }
    } catch (err) {
      console.error("Error in payment submission:", err);
      setError("An error occurred during payment processing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />

        <input
          type="text"
          placeholder="Address Line 1"
          value={address.line1}
          onChange={(e) => setAddress({ ...address, line1: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="State"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={address.postal_code}
          onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
          required
        />
        <CardElement />
        <button type="submit" disabled={!stripe || loading}>
          {loading ? 'Processing...' : 'Pay'}
        </button>
        {error && <div className="error">{error}</div>}
        {paymentSuccess && <div className="success">Payment Successful!</div>}
      </form>
    </div>
  );
};

export default CheckoutForm;
