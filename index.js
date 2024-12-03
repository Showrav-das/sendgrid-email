const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
require("dotenv").config();
const sendgrid = require("@sendgrid/mail");
// Middleware
app.use(cors());
app.use(express.json());

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
console.log("API Key:", process.env.SENDGRID_API_KEY);
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});
app.post("/send-email", async (req, res) => {
  res.send("Hello, Express!");
  const { name, email, phone } = req.body;
  console.log("detail:", name, email, phone);
  try {
    //admin receive
    await sendgrid.send({
      to: "admin@example.com",
      from: "showravdas8@gmail.com",
      subject: `New Contact Request from ${name}`,
      html: `
        <h3>New Contact Request Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `,
    });
    // client receive
    await sendgrid.send({
      to: email, // Client's email
      from: "showravdas8@gmail.com", // Verified sender email
      subject: "Thank You for Reaching Out!",
      html: `
        <h3>Hello ${name},</h3>
        <p>Thank you for getting in touch with us. We have received your request and will get back to you as soon as possible.</p>
        <p>If you have any urgent queries, feel free to contact us directly at <strong>support@example.com</strong>.</p>
        <p>Best regards,<br/>The Team</p>
      `,
    });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
