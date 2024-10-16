<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect form data
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);

    // Validate data
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Please complete the form correctly.";
        exit;
    }

    // Set recipient email
    $recipient = "your-email@example.com"; // Replace with your email

    // Build the email content
    $subject = "New contact from $name";
    $email_content = "Name: $name\n";
    $email_content = "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";

    // Send the email
    $headers = "From: $name <$email>";
    if (mail($recipient, $subject, $email_content, $headers)) {
        echo "Thank you for contacting us!";
    } else {
        echo "Oops! Something went wrong, please try again.";
    }
}
