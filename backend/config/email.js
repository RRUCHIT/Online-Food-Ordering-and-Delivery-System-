const nodemailer = require("nodemailer");
const dns = require('dns');

// Force Node.js to prefer IPv4 over IPv6 globally
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const sendEmail = async (options) => {
  // Use 'service: gmail' - Nodemailer's preferred way for Gmail
  // It handles the host/port/TLS logic automatically
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Keep timeouts high for Render's environment
    connectionTimeout: 40000,
    greetingTimeout: 40000,
    socketTimeout: 40000,
  });

  const mailOptions = {
    from: `"FoodHub Support" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };  

  try {
    // Send email directly
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Detailed Email Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
