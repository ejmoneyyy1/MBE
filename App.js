// App.js
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_51Q8l4IBbtBGrTlbjZdcf6tDZJuhAbgkSCX5wycO3qcQeJZEEr7Zg8yDRCYfGloP3v2bvk6VisrA9cPUCZ7J1P55k00qjcVj9Vm');

const App = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="App">
        <h1>Stripe Payment Gateway</h1>
        <CheckoutForm />
      </div>
    </Elements>
  );
};

export default App;
