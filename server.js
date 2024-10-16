const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51Q8l4IBbtBGrTlbjAC1IMq0M9V5Ox6JvCKVIFt4YyLtDZtiY3g2ic7KmamOceNOtqEZHcxF3KajmJbtGVRfvj7c700T6obIZTh'); // Replace with your actual secret Stripe key
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Combined server will run on port 3000

// Enable CORS for both localhost and 127.0.0.1
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:3000'],  // Add both origins
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Serve static files (like the contact form HTML)
app.use(express.static('public'));

// Body parser to handle JSON payloads
app.use(express.json());
app.use(bodyParser.json()); // Parse JSON request body

/*----------------------------------------
   Stripe Payment Route
----------------------------------------*/
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'cashapp'],  // Add 'cashapp' as a payment method
      line_items: req.body.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: item.price * 100,  // Amount in cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${req.headers.origin}/success.html`,
      cancel_url: `${req.headers.origin}/cancel.html`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

/*----------------------------------------
   Nodemailer Contact Form Route
----------------------------------------*/
// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'eaalobuia@gmail.com', // Replace with your Gmail address
    pass: 'oolp zuxa yniw xfqh',    // Replace with your generated App Password
  },
});

// Your send-email route
// Define the route for sending emails
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;
  
    // Check if all required fields are provided
    if (!name || !email || !message) {
      return res.status(400).send('All fields are required');
    }
  
    const mailOptions = {
      from: email,
      to: 'eaalobuia@gmail.com',  // Replace with your email where you want to receive submissions
      subject: `Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).send('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Failed to send email');
    }
  });
  

  
// Start the server on port 3000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
